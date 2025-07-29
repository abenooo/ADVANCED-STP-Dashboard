"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChromeIcon } from "@/components/icons";
import { useToast } from "@/components/ui/use-toast";
import adminImage from "@/public/admin.jpg";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: {email?: string; password?: string} = {};
    
    // Simple validation
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      // Show success toast
      toast({
        title: "Success",
        description: "Login successful!",
      });

      // Redirect to dashboard after successful login
      if (typeof window !== 'undefined') {
        window.location.href = "/?section=dashboard";
      }
    } catch (err) {
      // Show error toast
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : 'An error occurred during login',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'email' | 'password') => {
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    if (field === 'email') setEmail(e.target.value);
    if (field === 'password') setPassword(e.target.value);
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Left column */}
      <div className="flex flex-col w-full lg:w-1/2 px-8 py-12 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col justify-center">
          {/* Warning message for unauthorized access - Moved to top */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 w-full max-w-2xl mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-bold text-yellow-700">⚠️ Unauthorized Access Warning</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This system is for authorized users only.<br/>
                  All activities are monitored and logged.
                </p>
                <p className="text-xs text-yellow-600 mt-2">
                  🚨 Unauthorized access attempts are strictly prohibited and may result in legal action.<br/>
                  We actively track IP addresses, login attempts, and user behavior.
                </p>
                <p className="text-xs font-medium text-yellow-700 mt-2">
                  If you're not an authorized user, leave this page immediately.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-black">Login to your account</h1>
              <p className="mt-2 text-sm text-gray-600">
                Enter your email below to login to your account
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className={`mt-1 bg-white text-black ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-black">
                    Password
                  </label>
                  <Link href="#" className="text-sm text-black hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => handleInputChange(e, 'password')}
                  className={`mt-1 bg-white text-black ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Login
              </Button>
            </form>
            
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-xs text-gray-400">Or continue with</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            
            <Button
              variant="default"
              className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800"
            >
              <ChromeIcon className="h-5 w-5" />
              Login with Google
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Reset Password?{' '}
              <Link href="#" className="underline text-black">
                Reset Password
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right column */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Image
            src={adminImage}
            alt="Login illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
