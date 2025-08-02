"use client"

import { useEffect, useState } from 'react';

export default function DebugAuth() {
  const [cookies, setCookies] = useState<string>('');
  const [localStorage, setLocalStorage] = useState<any>({});
  const [sessionStorage, setSessionStorage] = useState<any>({});

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie);
    
    // Get localStorage
    const localStorageData: any = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        localStorageData[key] = window.localStorage.getItem(key);
      }
    }
    setLocalStorage(localStorageData);
    
    // Get sessionStorage
    const sessionStorageData: any = {};
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key) {
        sessionStorageData[key] = window.sessionStorage.getItem(key);
      }
    }
    setSessionStorage(sessionStorageData);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Cookies</h2>
          <pre className="text-sm overflow-auto">{cookies || 'No cookies found'}</pre>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Local Storage</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(localStorage, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Session Storage</h2>
          <pre className="text-sm overflow-auto">{JSON.stringify(sessionStorage, null, 2)}</pre>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Current URL</h2>
          <pre className="text-sm overflow-auto">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</pre>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Agent</h2>
          <pre className="text-sm overflow-auto">{typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A'}</pre>
        </div>
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Go to Login
        </button>
        <button 
          onClick={() => window.location.href = '/'} 
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 ml-2"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
