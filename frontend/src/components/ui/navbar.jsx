'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, ScanLine, Wallet2, User } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [active, setActive] = useState('home');
  const {isAuthenticated}= useAuth();
  const navItems = [
    { name: 'home', icon: Home, label: 'Home' },
    { name: 'scan', icon: ScanLine, label: 'Scan' },
    { name: 'wallet', icon: Wallet2, label: 'Wallet' },
    { name: 'profile', icon: User, label: 'Profile' },
  ];
  
  if(!isAuthenticated) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-safe">
      <nav className="bg-white rounded-t-2xl shadow-lg w-full max-w-md md:max-w-7xl">
        <div className="relative flex items-center justify-between px-6 py-2">
          <div className="flex justify-between w-full">
            <Link 
              href="/"
              className={`flex flex-col items-center gap-1 ml-3 ${
                active === 'home' ? 'text-[#7F3DFF]' : 'text-gray-400'
              }`}
              onClick={() => setActive('home')}
            >
              <Home className="h-6 w-6 md:h-10 md:w-10 " />
              <span className="text-xs font-medium">Home</span>
            </Link>
            
            <div className="flex justify-between w-1/2 sm:max-w-[140px] md:max-w-screen-md relative">
              <Link 
                href="/scan"
                className={`flex flex-col items-center gap-1 ${
                  active === 'scan' ? 'text-[#7F3DFF]' : 'text-gray-400'
                } relative left-[-15px]`}
                onClick={() => setActive('scan')}
              >
                <ScanLine className="h-6 w-6 md:h-10 md:w-10 " />
                <span className="text-xs font-medium">Scan</span>
              </Link>
              
              <Link 
                href="/wallet"
                className={`flex flex-col items-center gap-1 ${
                  active === 'wallet' ? 'text-[#7F3DFF]' : 'text-gray-400'
                } relative right-[-8px]`}
                onClick={() => setActive('wallet')}
              >
                <Wallet2 className="h-6 w-6 md:h-10 md:w-10 " />
                <span className="text-xs font-medium">Wallet</span>
              </Link>
            </div>
            
            <Link 
              href="/"
              className={`flex flex-col items-center gap-1 mr-1 ${
                active === 'profile' ? 'text-[#7F3DFF]' : 'text-gray-400'
              }`}
              onClick={() => setActive('profile')}
            >
              <User className="h-6 w-6 md:h-10 md:w-10 " />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          </div>

          {/* Center Image */}
          <Link 
            href="/"
            className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center h-14 w-14 rounded-full bg-[#7F3DFF] overflow-hidden shadow-lg z-10"
            aria-label="Main action"
            onClick={() => setActive('action')}
          >
            <Image
              src="/web-app-manifest-512x512.png"
              alt="App logo"
              width={80}
              height={80}
              className="object-cover"
            />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;