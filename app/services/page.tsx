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

interface SubService {
  _id: string
  title: string
  description: string
  heading: string
  image: string
}

interface Service {
  _id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  subService: SubService[]
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

  const getIconForSubService = (heading: string) => {
    switch (heading) {
      case "Cloud Readiness":
        return <Cloud className="w-5 h-5 text-orange-500" />
      case "Cloud Architecture":
        return <Server className="w-5 h-5 text-orange-500" />
      case "Cloud Migration":
        return <Database className="w-5 h-5 text-orange-500" />
      case "Cost Optimization":
        return <DollarSign className="w-5 h-5 text-orange-500" />
      case "Multi-cloud Strategy":
        return <Globe className="w-5 h-5 text-orange-500" />
      case "Cloud Management":
        return <Shield className="w-5 h-5 text-orange-500" />
      case "Cloud Connectivity":
        return <Zap className="w-5 h-5 text-orange-500" />
      case "SaaS Integration":
        return <Code className="w-5 h-5 text-orange-500" />
      case "CI/CD Pipeline":
        return <Activity className="w-5 h-5 text-orange-500" />
      case "Security Audits":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case "Firewall & IDS/IPS":
        return <Lock className="w-5 h-5 text-orange-500" />
      case "Endpoint Protection":
        return <Shield className="w-5 h-5 text-orange-500" />
      case "IAM":
        return <Fingerprint className="w-5 h-5 text-orange-500" />
      case "Compliance":
        return <FileText className="w-5 h-5 text-orange-500" />
      case "Security Training":
        return <GraduationCap className="w-5 h-5 text-orange-500" />
      case "SSO & IAM":
        return <Key className="w-5 h-5 text-orange-500" />
      case "MFA & VPN":
        return <Network className="w-5 h-5 text-orange-500" />
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
        <div className="flex gap-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Request a Quote</Button>
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          >
            Contact Sales
          </Button>
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
          <h2 className="text-xl font-bold text-white tracking-wider mt-8">Sub-Services for {service.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.subService.map((subService) => (
              <Card
                key={subService._id}
                className="bg-neutral-900 border-neutral-700 hover:border-orange-500/50 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    {getIconForSubService(subService.heading)}
                    <div>
                      <CardTitle className="text-sm font-bold text-white tracking-wider">
                        {subService.heading}
                      </CardTitle>
                      <p className="text-xs text-neutral-400">{subService.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <img
                    src={subService.image || "/placeholder.svg?height=100&width=100&query=subservice-icon"}
                    alt={subService.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <p className="text-sm text-neutral-300">{subService.description}</p>
                  <Button
                    variant="outline"
                    className="mt-4 w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
