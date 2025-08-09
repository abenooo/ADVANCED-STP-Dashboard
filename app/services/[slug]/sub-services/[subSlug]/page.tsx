import Link from "next/link"
import { getSubServiceBySlugs } from "@/lib/api/services"

// Server component to render a single sub-service detail page
// Note: Next.js 15 requires awaiting params
export default async function SubServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>
}) {
  const { slug, subSlug } = await params

  let sub: any
  try {
    const res = await getSubServiceBySlugs(slug, subSlug)
    const data = res?.data ?? res
    sub = data?.subService ?? data
  } catch (e: any) {
    return (
      <div className="space-y-4">
        <Link href="/services" className="text-orange-500 hover:underline">← Back to Services</Link>
        <h1 className="text-2xl font-semibold">Sub-service</h1>
        <p className="text-red-500">Failed to load sub-service. {e?.message || 'Unknown error'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/services" className="text-orange-500 hover:underline">← Back to Services</Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{sub?.subServiceName}</h1>
        {sub?.moto && <p className="text-muted-foreground">{sub.moto}</p>}
      </header>

      {sub?.definition && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">What it is</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{sub.definition}</p>
        </section>
      )}

      {sub?.commitment && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Our commitment</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{sub.commitment}</p>
        </section>
      )}

      {sub?.businessValue && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Business Value</h2>
          {sub.businessValue.businessValueDefinition && (
            <p className="text-sm text-muted-foreground">{sub.businessValue.businessValueDefinition}</p>
          )}
          {Array.isArray(sub.businessValue.values) && sub.businessValue.values.length > 0 && (
            <ul className="space-y-2">
              {sub.businessValue.values.map((v: any) => (
                <li key={v._id} className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {sub?.organizationNeed && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Organizational Needs</h2>
          {sub.organizationNeed.organizationalDefinition && (
            <p className="text-sm text-muted-foreground">{sub.organizationNeed.organizationalDefinition}</p>
          )}
          {Array.isArray(sub.organizationNeed.needs) && sub.organizationNeed.needs.length > 0 && (
            <ul className="space-y-2">
              {sub.organizationNeed.needs.map((n: any) => (
                <li key={n._id} className="flex gap-2">
                  <span className="text-orange-500">•</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {sub?.cta && (
        <section className="space-y-2 p-4 rounded-md border border-border bg-card">
          <h2 className="text-lg font-semibold text-foreground">{sub.cta.title}</h2>
          <p className="text-sm text-muted-foreground">{sub.cta.description}</p>
        </section>
      )}
    </div>
  )
}
