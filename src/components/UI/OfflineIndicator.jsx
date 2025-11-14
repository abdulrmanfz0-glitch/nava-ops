// src/components/UI/OfflineIndicator.jsx
import React, { useState, useEffect } from 'react';
 reporting-revolution
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {


export default function OfflineIndicator() {
 
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
 reporting-revolution
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff className="w-5 h-5" />
      <span className="font-medium">No internet connection</span>
    </div>
  );
};

export default OfflineIndicator;

    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center z-50">
      <p className="text-sm font-medium">
        ⚠️ No internet connection - Some features may not work
      </p>
    </div>
  );
}
 
