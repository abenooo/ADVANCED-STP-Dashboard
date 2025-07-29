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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">OUR SERVICES</h1>
          <p className="text-sm text-neutral-400">Explore the range of services we offer.</p>
        </div>
      </div>

      {services.map((service) => (
        <div key={service._id} className="space-y-6">
          {/* Main Service Card */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white tracking-wider">{service.name}</CardTitle>
              <p className="text-sm text-neutral-400">{service.description}</p>
            </CardHeader>
            <CardContent>
              <img
                src={service.imageUrl || "/placeholder.svg?height=200&width=400&query=service-banner"}
                alt={service.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {service.name.includes("Cloud") && (
                  <>
                    <Badge className="bg-orange-500/20 text-orange-500">Cloud</Badge>
                    <Badge className="bg-white/20 text-white">Migration</Badge>
                    <Badge className="bg-neutral-500/20 text-neutral-300">AWS</Badge>
                    <Badge className="bg-neutral-500/20 text-neutral-300">Azure</Badge>
                  </>
                )}
                {service.name.includes("Cybersecurity") && (
                  <>
                    <Badge className="bg-red-500/20 text-red-500">Cybersecurity</Badge>
                    <Badge className="bg-orange-500/20 text-orange-500">Risk Management</Badge>
                    <Badge className="bg-neutral-500/20 text-neutral-300">Compliance</Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sub-services Section */}
          <h2 className="text-xl font-bold text-white tracking-wider mt-8">Our {service.name} Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {service.subServices.map((subService) => (
              <Card
                key={subService._id}
                className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-4">
                    {getIconForSubService(subService.subServiceName)}
                    <div>
                      <CardTitle className="text-lg font-bold text-white tracking-wider">
                        {subService.subServiceName}
                      </CardTitle>
                      <p className="text-sm text-orange-400 italic">"{subService.moto}"</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-neutral-300">{subService.definition}</p>
                    <p className="text-sm text-neutral-400">{subService.commitment}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-neutral-800/50 p-4 rounded-md">
                    <h3 className="font-semibold text-white mb-2">Business Value</h3>
                    <p className="text-sm text-neutral-300 mb-3">{subService.businessValue.businessValueDefinition}</p>
                    <div className="space-y-2">
                      {subService.businessValue.values.map((value) => (
                        <div key={value._id} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <div>
                            <p className="text-sm font-medium text-white">{value.title}</p>
                            <p className="text-xs text-neutral-400">{value.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-neutral-800/50 p-4 rounded-md">
                    <h3 className="font-semibold text-white mb-2">Organizational Needs</h3>
                    <p className="text-sm text-neutral-300 mb-3">{subService.organizationNeed.organizationalDefinition}</p>
                    <div className="space-y-2">
                      {subService.organizationNeed.needs.map((need) => (
                        <div key={need._id} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <div>
                            <p className="text-sm font-medium text-white">{need.title}</p>
                            <p className="text-xs text-neutral-400">{need.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-orange-500/10 p-4 rounded-md border border-orange-500/30">
                    <h3 className="font-semibold text-orange-400">{subService.cta.title}</h3>
                    <p className="text-sm text-orange-300">{subService.cta.description}</p>
                    <Button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
