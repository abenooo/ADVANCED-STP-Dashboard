import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface SubServiceFormData {
  subServiceName: string
  slug: string
  moto: string
  definition: string
  commitment: string
  organizationNeed: {
    organizationalDefinition: string
    needs: { title: string; description: string }[]
  }
  businessValue: {
    businessValueDefinition: string
    values: { title: string; description: string }[]
  }
  cta: {
    title: string
    description: string
  }
}

interface SubServiceFormProps {
  onSubmit: (data: SubServiceFormData) => void
  onCancel: () => void
  initialData?: Partial<SubServiceFormData> & { _id?: string }
  isSubmitting?: boolean
}

export default function SubServiceForm({ onSubmit, onCancel, initialData = {}, isSubmitting = false }: SubServiceFormProps) {
  const [subServiceName, setSubServiceName] = useState(initialData.subServiceName || "")
  const [slug, setSlug] = useState(initialData.slug || "")
  const [moto, setMoto] = useState(initialData.moto || "")
  const [definition, setDefinition] = useState(initialData.definition || "")
  const [commitment, setCommitment] = useState(initialData.commitment || "")
  const [organizationalDefinition, setOrganizationalDefinition] = useState(initialData.organizationNeed?.organizationalDefinition || "")
  const [needs, setNeeds] = useState<{ title: string; description: string }[]>(initialData.organizationNeed?.needs || [{ title: "", description: "" }])
  const [businessValueDefinition, setBusinessValueDefinition] = useState(initialData.businessValue?.businessValueDefinition || "")
  const [values, setValues] = useState<{ title: string; description: string }[]>(initialData.businessValue?.values || [{ title: "", description: "" }])
  const [ctaTitle, setCtaTitle] = useState(initialData.cta?.title || "")
  const [ctaDescription, setCtaDescription] = useState(initialData.cta?.description || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // auto-generate slug from name if empty or matching previous pattern
  function slugify(v: string) {
    return v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
  }
  function handleNameChange(v: string) {
    setSubServiceName(v)
    if (!initialData.slug && (!slug || slug === slugify(slug))) {
      setSlug(slugify(v))
    }
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!subServiceName.trim()) e.subServiceName = 'Name is required'
    if (!slug.trim()) e.slug = 'Slug is required'
    if (!definition.trim()) e.definition = 'Definition is required'
    if (!commitment.trim()) e.commitment = 'Commitment is required'
    if (!organizationalDefinition.trim()) e.organizationalDefinition = 'Organizational definition is required'
    if (needs.length === 0 || needs.some(n => !n.title.trim() || !n.description.trim())) e.needs = 'Provide at least one need with title and description'
    if (!businessValueDefinition.trim()) e.businessValueDefinition = 'Business value definition is required'
    if (values.length === 0 || values.some(v => !v.title.trim() || !v.description.trim())) e.values = 'Provide at least one value with title and description'
    if (!ctaTitle.trim()) e.ctaTitle = 'CTA title is required'
    if (!ctaDescription.trim()) e.ctaDescription = 'CTA description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      subServiceName,
      slug,
      moto,
      definition,
      commitment,
      organizationNeed: {
        organizationalDefinition,
        needs,
      },
      businessValue: {
        businessValueDefinition,
        values,
      },
      cta: {
        title: ctaTitle,
        description: ctaDescription,
      },
    })
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData._id ? "Edit Sub-service" : "Add Sub-service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="subServiceName" className="w-48 shrink-0 text-right">Sub-service Name</Label>
                <Input id="subServiceName" className="flex-1" value={subServiceName} onChange={e => handleNameChange(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.subServiceName && <p className="text-sm text-red-500">{errors.subServiceName}</p>}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="slug" className="w-48 shrink-0 text-right">Slug</Label>
                <Input id="slug" className="flex-1" value={slug} onChange={e => setSlug(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center gap-3">
                <Label htmlFor="moto" className="w-48 shrink-0 text-right">Moto</Label>
                <Input id="moto" className="flex-1" value={moto} onChange={e => setMoto(e.target.value)} disabled={isSubmitting} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <Label htmlFor="definition" className="w-48 shrink-0 text-right mt-2">Definition</Label>
                <Textarea id="definition" className="flex-1" value={definition} onChange={e => setDefinition(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.definition && <p className="text-sm text-red-500">{errors.definition}</p>}
            </div>
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <Label htmlFor="commitment" className="w-48 shrink-0 text-right mt-2">Commitment</Label>
                <Textarea id="commitment" className="flex-1" value={commitment} onChange={e => setCommitment(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.commitment && <p className="text-sm text-red-500">{errors.commitment}</p>}
            </div>
          </div>

          {/* Organization Need */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <Label htmlFor="organizationalDefinition" className="w-48 shrink-0 text-right mt-2">Organizational Definition</Label>
                <Textarea id="organizationalDefinition" className="flex-1" value={organizationalDefinition} onChange={e => setOrganizationalDefinition(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.organizationalDefinition && <p className="text-sm text-red-500">{errors.organizationalDefinition}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="w-48 shrink-0 text-right">Needs</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setNeeds(prev => [...prev, { title: "", description: "" }])} disabled={isSubmitting}>Add Need</Button>
              </div>
              {needs.map((n, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input placeholder="Title" value={n.title} onChange={e => setNeeds(prev => prev.map((p,i)=> i===idx? { ...p, title: e.target.value }: p))} disabled={isSubmitting} />
                  <Input placeholder="Description" value={n.description} onChange={e => setNeeds(prev => prev.map((p,i)=> i===idx? { ...p, description: e.target.value }: p))} disabled={isSubmitting} />
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="button" variant="ghost" onClick={() => setNeeds(prev => prev.filter((_,i)=> i!==idx))} disabled={isSubmitting}>Remove</Button>
                  </div>
                </div>
              ))}
              {errors.needs && <p className="text-sm text-red-500">{errors.needs}</p>}
            </div>
          </div>

          {/* Business Value */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <Label htmlFor="businessValueDefinition" className="w-48 shrink-0 text-right mt-2">Business Value Definition</Label>
                <Textarea id="businessValueDefinition" className="flex-1" value={businessValueDefinition} onChange={e => setBusinessValueDefinition(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.businessValueDefinition && <p className="text-sm text-red-500">{errors.businessValueDefinition}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="w-48 shrink-0 text-right">Values</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setValues(prev => [...prev, { title: "", description: "" }])} disabled={isSubmitting}>Add Value</Button>
              </div>
              {values.map((v, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Input placeholder="Title" value={v.title} onChange={e => setValues(prev => prev.map((p,i)=> i===idx? { ...p, title: e.target.value }: p))} disabled={isSubmitting} />
                  <Input placeholder="Description" value={v.description} onChange={e => setValues(prev => prev.map((p,i)=> i===idx? { ...p, description: e.target.value }: p))} disabled={isSubmitting} />
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="button" variant="ghost" onClick={() => setValues(prev => prev.filter((_,i)=> i!==idx))} disabled={isSubmitting}>Remove</Button>
                  </div>
                </div>
              ))}
              {errors.values && <p className="text-sm text-red-500">{errors.values}</p>}
            </div>
          </div>

          {/* CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Label htmlFor="ctaTitle" className="w-48 shrink-0 text-right">CTA Title</Label>
                <Input id="ctaTitle" className="flex-1" value={ctaTitle} onChange={e => setCtaTitle(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.ctaTitle && <p className="text-sm text-red-500">{errors.ctaTitle}</p>}
            </div>
            <div className="space-y-1">
              <div className="flex items-start gap-3">
                <Label htmlFor="ctaDescription" className="w-48 shrink-0 text-right mt-2">CTA Description</Label>
                <Textarea id="ctaDescription" className="flex-1" value={ctaDescription} onChange={e => setCtaDescription(e.target.value)} required disabled={isSubmitting} />
              </div>
              {errors.ctaDescription && <p className="text-sm text-red-500">{errors.ctaDescription}</p>}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData._id ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{initialData._id ? "Update" : "Add"}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 