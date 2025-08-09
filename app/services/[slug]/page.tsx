import Link from "next/link"
import { getServiceBySlug, getServices } from "@/lib/api/services"

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
      <div className="p-6 space-y-4 max-w-5xl mx-auto">
        <Link href="/services" className="text-orange-500 hover:underline">← Back to Services</Link>
        <h1 className="text-2xl font-semibold">Service</h1>
        <p className="text-red-500">Failed to load service. {primaryError?.message || "Not found"}</p>
      </div>
    )
  }

  const subServices = service?.subServices || service?.subService || []

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/services" className="text-orange-500 hover:underline">← Back to Services</Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{service?.name}</h1>
        {service?.description && (
          <p className="text-sm text-muted-foreground">{service.description}</p>
        )}
      </header>

      <div className="flex items-center justify-between mt-6">
        <h2 className="text-xl font-semibold">Sub-services</h2>
      </div>

      {subServices.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sub-services yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subServices.map((sub: any) => (
            <div key={sub._id} className="p-6 bg-card border border-border rounded-md">
              <div className="mb-3">
                <h3 className="font-semibold text-orange-500 text-lg">{sub.subServiceName}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {sub?.moto || (sub?.definition ? String(sub.definition).slice(0, 160) : "View details")}
              </p>
              <Link
                href={`/services/${slug}/sub-services/${sub.slug || sub.subServiceSlug || sub._id}`}
                className="inline-flex items-center rounded-md bg-orange-500 px-3 py-2 text-xs font-medium text-white hover:bg-orange-600"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
