"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function JobApplicationsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wider">JOB APPLICATIONS</h1>
      <p className="text-sm text-neutral-400">Manage incoming job applications.</p>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-300">
            <p>Total Applications: 120</p>
            <p>New Applications (Today): 5</p>
            <p>Pending Review: 30</p>
            <p>Interviews Scheduled: 10</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
