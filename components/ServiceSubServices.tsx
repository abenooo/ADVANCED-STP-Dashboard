"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import SubServiceForm from "@/components/SubServiceForm"
import { createSubService, updateSubService, deleteSubService, type SubService } from "@/lib/api/services"

interface Props {
  serviceId: string
  serviceSlug: string
  subServices: SubService[]
}

export default function ServiceSubServices({ serviceId, serviceSlug, subServices }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SubService | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState<SubService | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onCreate = () => {
    setEditing(null)
    setShowForm(true)
  }

  const onEdit = (sub: SubService) => {
    setEditing(sub)
    setShowForm(true)
  }

  const onDelete = (sub: SubService) => {
    setDeleting(sub)
    setShowDeleteDialog(true)
  }

  const getSubSlug = (sub: SubService) => sub.slug || sub.subServiceSlug || ""

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (editing) {
        await updateSubService(serviceId, getSubSlug(editing), data)
        toast({ title: "Success", description: "Sub-service updated" })
      } else {
        await createSubService(serviceId, data)
        toast({ title: "Success", description: "Sub-service created" })
      }
      setShowForm(false)
      router.refresh()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Action failed", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      setIsSubmitting(true)
      await deleteSubService(serviceId, getSubSlug(deleting))
      toast({ title: "Deleted", description: "Sub-service deleted" })
      setShowDeleteDialog(false)
      setDeleting(null)
      router.refresh()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Delete failed", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Sub-services</h2>
        <Button onClick={onCreate} disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Add Sub-service"}
        </Button>
      </div>

      {subServices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sub-services yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subServices.map((sub) => (
            <Card key={sub._id} className="p-6 bg-card border border-border rounded-md">
              <div className="mb-3">
                <h3 className="font-semibold text-orange-500 text-lg">{sub.subServiceName}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {sub?.moto || (sub?.definition ? String(sub.definition).slice(0, 160) : "View details")}
              </p>
              <div className="flex gap-2">
                <Link href={`/services/${serviceSlug}/sub-services/${getSubSlug(sub)}`}>
                  <Button size="sm" variant="secondary" disabled={isSubmitting}>View</Button>
                </Link>
                <Button size="sm" onClick={() => onEdit(sub)} disabled={isSubmitting}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(sub)} disabled={isSubmitting}>Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Sub-service" : "Add Sub-service"}</DialogTitle>
          </DialogHeader>
          <SubServiceForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            initialData={editing || {}}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete sub-service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
