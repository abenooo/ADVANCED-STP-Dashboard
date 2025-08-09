import Link from "next/link"
import { getServiceBySlug, getServices } from "@/lib/api/services"
import ServiceSubServices from "@/components/ServiceSubServices"
import ServiceActions from "@/components/ServiceActions"

// Server component to render sub-services for a single service
// Next.js 15 requires awaiting params
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let service: any = null
  let primaryError: any = null
  try {
    const res = await getServiceBySlug(slug)
    service = res?.data ?? res
  } catch (e: any) {
    primaryError = e
    // Fallback: load all services and find by slug
    try {
      const list = await getServices()
      const items = list?.data ?? []
      service = items.find((s: any) => s.slug === slug || s.serviceSlug === slug)
    } catch {
      // ignore, handled by not-found UI below
    }
  }

  if (!service) {
    return (
      <div className="space-y-4">
        <Link href="/services" className="text-orange-500 hover:underline">← Back to Services</Link>
        <h1 className="text-2xl font-semibold">Service</h1>
        <p className="text-red-500">Failed to load service. {primaryError?.message || "Not found"}</p>
      </div>
    )
  }

  const subServices = service?.subServices || service?.subService || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/services" className="text-orange-500 hover:underline">← Back to Services</Link>
      </div>

      <header className="space-y-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">{service?.name}</h1>
          <ServiceActions service={service} />
        </div>
        {service?.description && (
          <p className="text-sm text-muted-foreground">{service.description}</p>
        )}
      </header>

      <ServiceSubServices serviceId={service._id} serviceSlug={slug} subServices={subServices} />
    </div>
  )
}
