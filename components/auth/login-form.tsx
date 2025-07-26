"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChromeIcon } from "@/components/icons";
import adminImage from "@/public/admin.jpg";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Handle error (show message, etc.)
        alert("Invalid credentials");
        return;
      }

      // Redirect to dashboard after successful login
      window.location.href = "/?section=dashboard";
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* Left column */}
      <div className="flex flex-col w-full lg:w-1/2 justify-center px-8 py-12 bg-white border-r border-gray-200">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Login to your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-transparent"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-transparent"
              />
            </div>
            <Button
              type="submit"
              className="w-full outline bg-black text-white"
            >
              Login
            </Button>
          </form>
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 " />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <ChromeIcon className="h-5 w-5" />
            Login with Google
          </Button>
          <p className="text-center text-sm text-gray-600">
            Reset Password?{" "}
            <Link href="#" className="underline">
              Reset Password
            </Link>
          </p>
        </div>
      </div>
      {/* Right column */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Image
            src={adminImage}
            alt="Login illustration"
         
          />
        </div>
      </div>
    </div>
  );
}
