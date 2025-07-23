"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BlogPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wider">BLOG MANAGEMENT</h1>
      <p className="text-sm text-neutral-400">Manage blog posts and content.</p>

      <Card className="bg-neutral-900 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">OVERVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-neutral-300">
            <p>Total Posts: 45</p>
            <p>Published Posts: 40</p>
            <p>Drafts: 5</p>
            <p>Comments Awaiting Moderation: 7</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
