"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import ServiceForm from "@/components/ServiceForm"
import { updateService, deleteService, type Service } from "@/lib/api/services"

interface Props {
  service: Service
}

export default function ServiceActions({ service }: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onEdit = () => setShowForm(true)
  const onDelete = () => setShowDelete(true)

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true)
      await updateService(service._id, data)
      toast({ title: "Success", description: "Service updated" })
      setShowForm(false)
      router.refresh()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Update failed", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    try {
      setIsSubmitting(true)
      await deleteService(service._id)
      toast({ title: "Deleted", description: "Service deleted" })
      setShowDelete(false)
      router.push("/services")
      router.refresh()
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Delete failed", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={onEdit} disabled={isSubmitting}>Edit</Button>
      <Button size="sm" variant="destructive" onClick={onDelete} disabled={isSubmitting}>Delete</Button>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            initialData={service}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service "{service.name}".
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
