"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BookingPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wider">BOOKING MANAGEMENT</h1>
      <p className="text-sm text-neutral-400">Manage service bookings and appointments.</p>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-300">
            <p>Total Bookings: 85</p>
            <p>Upcoming Bookings: 12</p>
            <p>Completed Bookings (Last 7 Days): 25</p>
            <p>Cancellations: 3</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
