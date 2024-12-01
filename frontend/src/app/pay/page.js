'use client';

import { useRouter } from 'next/navigation';
import { Utensils, Printer, Megaphone, User, BanIcon as Badminton } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const vendors = [
  {
    id: 'canteen1',
    name: 'Canteen',
    icon: Utensils,
  },
  {
    id: 'stationery1',
    name: 'Stationery',
    icon: Printer,
  },
  {
    id: 'recreation1',
    name: 'Recreation',
    icon: Badminton,
  },
  {
    id: 'events1',
    name: 'Events',
    icon: Megaphone,
  },
  {
    id: 'others1',
    name: 'Others',
    icon: User,
  },
];

export default function VendorsPage({ userId }) {
  const router = useRouter();

  const handleVendorSelect = (vendorId) => {
    if (vendorId === 'others1' && userId) {
      // If userId exists, navigate to scan page with userId
      router.push(`/scan?userId=${userId}`);
    } else {
      // Otherwise navigate to payment page with vendorId
      router.push(`/payment?vendorId=${vendorId}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 max-w-[350px] md:max-w-[450px] -mt-20">
        <div className="p-4 flex flex-col items-center justify-center h-[75vh]">
          <div className="text-center mb-4">
            <h1 className="text-2xl mb-2">Select Vendor</h1>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {vendors.map((vendor) => {
              const Icon = vendor.icon;
              return (
                <Button
                  key={vendor.id}
                  variant="ghost"
                  className="h-32 w-32 flex flex-col items-center justify-center gap-2 bg-[#7F3DFF] hover:bg-[#7F3DFF]/90"
                  onClick={() => handleVendorSelect(vendor.id)}
                >
                  <Icon className="w-10 h-10 text-white" />
                  <span className="text-white text-sm font-medium text-center">
                    {vendor.name}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
