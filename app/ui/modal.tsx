"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl p-0 border-none bg-transparent">{children}</DialogContent>
    </Dialog>
  )
}
