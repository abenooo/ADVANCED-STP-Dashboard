"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UserPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wider">USER MANAGEMENT</h1>
      <p className="text-sm text-neutral-400">Manage user accounts and profiles.</p>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-300">
            <p>Total Users: 500</p>
            <p>New Users (Today): 10</p>
            <p>Active Users: 450</p>
            <p>Blocked Users: 5</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
