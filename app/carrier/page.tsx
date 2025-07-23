"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CarrierPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wider">CARRIER MANAGEMENT</h1>
      <p className="text-sm text-neutral-400">Manage carrier partners and logistics.</p>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-300">
            <p>Total Carriers: 25</p>
            <p>Active Carriers: 20</p>
            <p>Pending Verification: 3</p>
            <p>Shipments in Progress: 150</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
