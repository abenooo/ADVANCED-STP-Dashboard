"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        {/* Sidebar */}
        <AppSidebar />
        {/* Content inset to mirror original layout spacing/behavior */}
        <SidebarInset className="p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
