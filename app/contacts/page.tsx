"use client"

import { useEffect, useState } from "react"
import { getContacts, type Contact } from "@/lib/api/contacts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await getContacts()
      // API returns { success, data }
      setContacts(Array.isArray((res as any)?.data) ? (res as any).data : (contacts || []))
    } catch (e: any) {
      setError(e?.message || "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts (Public Site)</h1>
        <Button onClick={handleRefresh} disabled={loading || refreshing}>
          {refreshing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Refreshing...</>) : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading contacts...</div>
      ) : error ? (
        <Card className="p-4 text-red-600">{error}</Card>
      ) : contacts.length === 0 ? (
        <Card className="p-4 text-muted-foreground">No contacts found.</Card>
      ) : (
        <Card className="p-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="p-2 w-12">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Company</th>
                <th className="p-2">Description</th>
                <th className="p-2">Source</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, idx) => (
                <tr key={c._id} className="border-t">
                  <td className="p-2 text-muted-foreground">{idx + 1}</td>
                  <td className="p-2 whitespace-nowrap">{c.fullName}</td>
                  <td className="p-2 whitespace-nowrap">{c.email}</td>
                  <td className="p-2 whitespace-nowrap">{c.companyName || "-"}</td>
                  <td className="p-2 max-w-[480px] truncate" title={c.description}>{c.description}</td>
                  <td className="p-2 whitespace-nowrap">{c.source || "website-contact-form"}</td>
                  <td className="p-2 whitespace-nowrap">{c.status || "new"}</td>
                  <td className="p-2 whitespace-nowrap">{new Date(c.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
