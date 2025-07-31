import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface SubServiceFormData {
  subServiceName: string
  slug: string
  moto: string
  definition: string
  commitment: string
}

interface SubServiceFormProps {
  onSubmit: (data: SubServiceFormData) => void
  onCancel: () => void
  initialData?: Partial<SubServiceFormData> & { _id?: string }
}

export default function SubServiceForm({ onSubmit, onCancel, initialData = {} }: SubServiceFormProps) {
  const [subServiceName, setSubServiceName] = useState(initialData.subServiceName || "")
  const [slug, setSlug] = useState(initialData.slug || "")
  const [moto, setMoto] = useState(initialData.moto || "")
  const [definition, setDefinition] = useState(initialData.definition || "")
  const [commitment, setCommitment] = useState(initialData.commitment || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ subServiceName, slug, moto, definition, commitment })
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{initialData._id ? "Edit Sub-service" : "Add Sub-service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subServiceName">Sub-service Name</Label>
            <Input
              id="subServiceName"
              value={subServiceName}
              onChange={e => setSubServiceName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="moto">Moto</Label>
            <Input
              id="moto"
              value={moto}
              onChange={e => setMoto(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="definition">Definition</Label>
            <Textarea
              id="definition"
              value={definition}
              onChange={e => setDefinition(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commitment">Commitment</Label>
            <Textarea
              id="commitment"
              value={commitment}
              onChange={e => setCommitment(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData._id ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 