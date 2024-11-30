'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import axios from 'axios';
// import Cookies from 'js-cookie';

const AuthContext = createContext();
const AuthProviderWithRouter = ({ children }) => {
  const pathname= usePathname();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      console.log(response.data.user);
      localStorage.setItem('accessToken', response.data.accessToken);
    //   Cookies.set('protectionToken',response.data.protectionToken, {path: '' });
      // localStorage.setItem('protectionToken', response.data.protectionToken);
      router.push('/employee/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
    //   Cookies.remove('protectionToken');
      router.push('/employee');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token`,
        null,
        { withCredentials: true }
      );
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      localStorage.setItem('accessToken', response.data.accessToken);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      setAccessToken(null);
      setUser(null);
      localStorage.removeItem('accessToken');
      Cookies.remove('protectionToken');
      router.push('/employee');
      return false;
    }
  };

  useEffect(() => {
    console.log(user);
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem('accessToken');
      if (storedAccessToken) {
        try {
          const validationResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/validate`, {
            headers: { Authorization: `Bearer ${storedAccessToken}` },
            withCredentials: true,
          });
          console.log(validationResponse)
          setAccessToken(storedAccessToken);
          setUser(validationResponse.data.user);
        } catch (error) {
          console.log('Access token invalid, attempting refresh...');
          const success = await refreshAccessToken();
          if (!success) {
            console.log('Refresh failed, logging out.');
          }
        }
      } else {
        console.log('No access token found, redirecting to login.');
        console.log(pathname);
        if(pathname.startsWith("/employee")){
          router.push('/employee');
        }
      }
    };

    if (typeof window !== 'undefined') {
      initializeAuth();
    }

    const syncAuthAcrossTabs = () => {
      setAccessToken(localStorage.getItem('accessToken'));
    };

    window.addEventListener('storage', syncAuthAcrossTabs);
    return () => {
      window.removeEventListener('storage', syncAuthAcrossTabs);
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ token: accessToken, user, isAuthenticated: !!accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <AuthProviderWithRouter>{children}</AuthProviderWithRouter> : null;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};