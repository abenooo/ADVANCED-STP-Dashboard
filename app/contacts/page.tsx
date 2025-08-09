"use client"

import { useEffect, useState } from "react"
import { getContacts, updateContactStatus, deleteContact, type Contact } from "@/lib/api/contacts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Edit state
  const [editId, setEditId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<'new' | 'reviewed' | 'contacted' | 'archived'>('new')
  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { toast } = useToast()

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

  const openEdit = (c: Contact) => {
    setSelectedStatus((c.status as any) || 'new')
    setEditId(c._id)
  }

  const submitEdit = async () => {
    if (!editId) return
    try {
      setIsSubmitting(true)
      await updateContactStatus(editId, selectedStatus)
      toast({ title: 'Updated', description: 'Contact status updated successfully' })
      setEditId(null)
      await load()
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    try {
      setIsSubmitting(true)
      await deleteContact(deleteId)
      toast({ title: 'Deleted', description: 'Contact deleted successfully' })
      setDeleteId(null)
      await load()
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to delete', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
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
                <th className="p-2 w-40">Actions</th>
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
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openEdit(c)} disabled={isSubmitting}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteId(c._id)} disabled={isSubmitting}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editId} onOpenChange={(open) => !open && setEditId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">Select new status</label>
            <select
              className="w-full rounded border border-border bg-background p-2 text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              disabled={isSubmitting}
            >
              <option value="new">new</option>
              <option value="reviewed">reviewed</option>
              <option value="contacted">contacted</option>
              <option value="archived">archived</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditId(null)} disabled={isSubmitting}>Cancel</Button>
              <Button onClick={submitEdit} disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Saving...</>) : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete contact?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
