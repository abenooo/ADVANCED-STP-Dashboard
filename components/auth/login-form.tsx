"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GithubIcon, ChromeIcon } from "@/components/icons" // Assuming these are custom icons or need to be added

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", { email, password, rememberMe })
    // Implement your login logic here
  }

  return (
    <Card className="mx-auto grid w-full max-w-4xl grid-cols-1 items-center gap-6 rounded-lg border border-neutral-700 bg-neutral-900 p-6 shadow-lg md:grid-cols-2 md:p-8">
      <div className="space-y-6">
        <div className="space-y-2 text-center md:text-left">
          <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-neutral-400">Sign in to your account to continue.</CardDescription>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white border-neutral-700"
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full bg-neutral-800 text-white hover:bg-neutral-700 hover:text-white border-neutral-700"
          >
            <ChromeIcon className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
        <div className="relative flex items-center">
          <Separator className="flex-grow border-neutral-700" />
          <span className="mx-4 text-sm text-neutral-500">OR</span>
          <Separator className="flex-grow border-neutral-700" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-neutral-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-orange-500"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <Link
                href="#"
                className="ml-auto inline-block text-sm underline text-orange-500 hover:text-orange-400"
                prefetch={false}
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
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
              className="border-neutral-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-white"
            />
            <Label htmlFor="remember-me" className="text-neutral-300">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700">
            Login
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link href="#" className="underline text-orange-500 hover:text-orange-400" prefetch={false}>
            Sign up
          </Link>
        </div>
      </div>
      <div className="hidden md:block">
        <img
          src="/placeholder.svg?height=600&width=400"
          width={400}
          height={600}
          alt="Login background"
          className="h-full w-full rounded-lg object-cover"
        />
      </div>
    </Card>
  )
}
