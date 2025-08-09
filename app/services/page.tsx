"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { getServices, createService, updateService, deleteService, type Service, createSubService, updateSubService, deleteSubService, type SubService } from "@/lib/api/services"
import ServiceForm from "@/components/ServiceForm"
import SubServiceForm from "@/components/SubServiceForm"
import Link from "next/link"
import {
  Cloud,
  Server,
  Database,
  Shield,
  Globe,
} from "lucide-react"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  
  // Modal states
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Add these new states
  const [showSubServiceForm, setShowSubServiceForm] = useState(false)
  const [showSubServiceDeleteDialog, setShowSubServiceDeleteDialog] = useState(false)
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

    const fetchServices = async () => {
      try {
        setLoading(true)
        const response = await getServices()
        
        if (!response.success) {
          throw new Error('Failed to fetch services')
        }
        
        // The API returns { success: true, data: [...] }
        const servicesData = response.data || []
        
        // Ensure all services have subServices array (handle both subService and subServices)
        const servicesWithDefaults = servicesData.map((service: any) => ({
          ...service,
          subServices: service.subServices || service.subService || [],
          subService: service.subService || service.subServices || []
        }))
        
        setServices(servicesWithDefaults)
      } catch (err: any) {
        console.error('Error fetching services:', err)
        setError(err.message || 'Failed to load services. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

  const getIconForSubService = (subServiceName: string) => {
    switch (subServiceName.toLowerCase()) {
      case 'cloud migration':
        return <Database className="w-5 h-5 text-orange-500" />
      case 'cloud storage':
        return <Server className="w-5 h-5 text-orange-500" />
      case 'multi-cloud strategy':
        return <Globe className="w-5 h-5 text-orange-500" />
      case 'cloud security':
        return <Shield className="w-5 h-5 text-orange-500" />
      default:
        return <Cloud className="w-5 h-5 text-orange-500" />
    }
  }

  const handleCreateService = () => {
    setSelectedService(null)
    setShowServiceForm(true)
  }

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    setShowServiceForm(true)
  }

  const handleDeleteService = (service: Service) => {
    setSelectedService(service)
    setShowDeleteDialog(true)
  }

  const handleSubmitService = async (data: any) => {
    try {
      setIsSubmitting(true)
      if (selectedService) {
        await updateService(selectedService._id, data)
        toast({
          title: "Success",
          description: "Service updated successfully",
        })
      } else {
        await createService(data)
        toast({
          title: "Success",
          description: "Service created successfully",
        })
      }
      setShowServiceForm(false)
      fetchServices()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedService) return
    
    try {
      setIsSubmitting(true)
      await deleteService(selectedService._id)
      toast({
        title: "Success",
        description: "Service deleted successfully",
      })
      setShowDeleteDialog(false)
      setSelectedService(null)
      fetchServices()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateSubService = () => {
    setSelectedSubService(null)
    setShowSubServiceForm(true)
  }

  const handleEditSubService = (subService: SubService) => {
    setSelectedSubService(subService)
    setShowSubServiceForm(true)
  }

  const handleDeleteSubService = (subService: SubService) => {
    setSelectedSubService(subService)
    setShowSubServiceDeleteDialog(true)
  }

  const handleSubmitSubService = async (data: any) => {
    if (!currentSelectedService) return
    
    try {
      setIsSubmitting(true)
      if (selectedSubService) {
        await updateSubService(currentSelectedService._id, selectedSubService._id, data)
        toast({
          title: "Success",
          description: "Sub-service updated successfully",
        })
      } else {
        await createSubService(currentSelectedService._id, data)
        toast({
          title: "Success",
          description: "Sub-service created successfully",
        })
      }
      setShowSubServiceForm(false)
      fetchServices()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDeleteSubService = async () => {
    if (!selectedSubService || !currentSelectedService) return
    
    try {
      setIsSubmitting(true)
      await deleteSubService(currentSelectedService._id, selectedSubService._id)
      toast({
        title: "Success",
        description: "Sub-service deleted successfully",
      })
      setShowSubServiceDeleteDialog(false)
      setSelectedSubService(null)
      fetchServices()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-neutral-400">
        <p>Loading services...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error loading services: {error}</p>
      </div>
    )
  }

  const currentSelectedService = services.find(s => s._id === selectedServiceId)

  return (
    <div className="p-6 space-y-6">
      {/* Create Service Button */}
      <Button className="mb-4" onClick={handleCreateService}>
        Create Service
      </Button>
      
      {/* List of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <Card
            key={service._id}
            className={`
              p-6 bg-card border border-border hover:border-orange-500 transition-colors relative group
            `}
          >
            <CardHeader className="flex flex-col gap-2 p-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-foreground">{service.name}</CardTitle>
        </div>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </CardHeader>
            {/* Service CRUD Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={e => {
                  e.stopPropagation()
                  handleEditService(service)
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={e => {
                  e.stopPropagation()
                  handleDeleteService(service)
                }}
              >
                Delete
              </Button>
              {(service.slug || service.serviceSlug) ? (
                <Link
                  href={`/services/${service.slug || service.serviceSlug}`}
                  className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
                >
                  View Sub-services
                </Link>
              ) : (
                <span className="text-xs text-muted-foreground">No slug available</span>
              )}
              </div>
          </Card>
        ))}
      </div>

      {/* Service Form Modal */}
      <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <ServiceForm
            onSubmit={handleSubmitService}
            onCancel={() => setShowServiceForm(false)}
            initialData={selectedService || {}}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              "{selectedService?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sub-service Form Modal */}
      <Dialog open={showSubServiceForm} onOpenChange={setShowSubServiceForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSubService ? "Edit Sub-service" : "Add Sub-service"}</DialogTitle>
          </DialogHeader>
          <SubServiceForm
            onSubmit={handleSubmitSubService}
            onCancel={() => setShowSubServiceForm(false)}
            initialData={selectedSubService || {}}
          />
        </DialogContent>
      </Dialog>

      {/* Sub-service Delete Confirmation Dialog */}
      <AlertDialog open={showSubServiceDeleteDialog} onOpenChange={setShowSubServiceDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sub-service
              "{selectedSubService?.subServiceName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteSubService}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
