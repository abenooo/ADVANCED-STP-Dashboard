"use client"

import type * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Briefcase, BookOpen, Calendar, Users, Package, Settings, LogOut, User, Home } from "lucide-react"
import { performLogout } from "@/lib/utils/logout"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { SearchForm } from "./search-form"

// Menu items.
const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home, 
  },
  {
    title: "Job Applications",
    url: "/job-applications",
    icon: Briefcase,
  },
  {
    title: "Services",
    url: "/services",
    icon: Settings,
  },
  {
    title: "Carrier",
    url: "/carrier",
    icon: Package,
  },
  {
    title: "Booking",
    url: "/booking",
    icon: Calendar,
  },
  {
    title: "User",
    url: "/user",
    icon: Users,
  },
  {
    title: "Blog",
    url: "/blog",
    icon: BookOpen,
  },
  {
    title: "Services",
    url: "/services",
    icon: Settings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    // Use comprehensive logout function
    await performLogout()
  }
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/profile">
                <User />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div onClick={handleLogout} className="cursor-pointer">
                <LogOut />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
