"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Cloud,
  Server,
  Database,
  Shield,
  DollarSign,
  Globe,
  Code,
  Zap,
  Activity,
  AlertTriangle,
  Lock,
  Network,
  Fingerprint,
  GraduationCap,
  Key,
  FileText,
} from "lucide-react"

interface Need {
  _id: string
  title: string
  description: string
}

interface Value {
  _id: string
  title: string
  description: string
}

interface CTA {
  _id: string
  title: string
  description: string
}

interface BusinessValue {
  businessValueDefinition: string
  values: Value[]
}

interface OrganizationNeed {
  organizationalDefinition: string
  needs: Need[]
}

interface SubService {
  _id: string
  subServiceName: string
  slug: string
  moto: string
  definition: string
  commitment: string
  organizationNeed: OrganizationNeed
  businessValue: BusinessValue
  cta: CTA
}

interface Service {
  _id: string
  name: string
  slug: string
  description: string
  moto: string
  imageUrl: string
  icon: string
  subServices: SubService[]
  __v: number
  createdAt: string
  updatedAt: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Fetch from the local API route instead of the external one
        const response = await fetch("/api/services")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: Service[] = await response.json()
        setServices(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

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

  if (services.length === 0) {
    return (
      <div className="p-6 text-center text-neutral-400">
        <p>No services found.</p>
      </div>
    )
  }

  // Find the selected service
  const selectedService = services.find(s => s._id === selectedServiceId)

  return (
    <div className="p-6 space-y-6">
      {/* Create Service Button */}
      <Button className="mb-4" onClick={() => {/* open create service modal */}}>
        Create Service
      </Button>
      {/* List of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <Card
            key={service._id}
            className={`cursor-pointer bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700 ${
              selectedServiceId === service._id ? 'border-orange-500' : ''
            }`}
            onClick={() => setSelectedServiceId(service._id)}
          >
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-white">{service.name}</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{service.description}</p>
            </CardHeader>
            {/* Service CRUD Buttons */}
            <div className="flex gap-2 px-4 pb-4">
              <Button size="sm" onClick={e => {e.stopPropagation(); /* open edit service modal */}}>Edit</Button>
              <Button size="sm" variant="destructive" onClick={e => {e.stopPropagation(); /* handle delete service */}}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Sub-services for selected service */}
      {selectedService && (
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            {selectedService.name} - Sub Services
          </h2>
          <Button className="mb-4" onClick={() => {/* open create sub-service modal */}}>
            Create Sub-service
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedService.subServices.map(subService => (
              <Card key={subService._id} className="bg-white border-neutral-200 dark:bg-neutral-900 dark:border-neutral-700">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    {getIconForSubService(subService.subServiceName)}
                    <div>
                      <h3 className="font-semibold text-orange-500 dark:text-orange-400 text-lg mb-1">
                        {subService.subServiceName}
                      </h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-md">
                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Business Value</h4>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">{subService.businessValue.businessValueDefinition}</p>
                    <div className="space-y-2">
                      {subService.businessValue.values.map((value) => (
                        <div key={value._id} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{value.title}</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">{value.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-md">
                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Organizational Needs</h4>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">{subService.organizationNeed.organizationalDefinition}</p>
                    <div className="space-y-2">
                      {subService.organizationNeed.needs.map((need) => (
                        <div key={need._id} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{need.title}</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">{need.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* CRUD Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={() => {/* open edit sub-service modal */}}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => {/* handle delete sub-service */}}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
