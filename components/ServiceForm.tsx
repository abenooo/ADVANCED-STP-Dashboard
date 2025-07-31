import React, { useState, useEffect, FormEvent, ChangeEvent, JSX } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Image as ImageIcon, FileText, Tag, X } from "lucide-react"
import { toast } from "sonner"
import { slugify } from "@/lib/utils/string"

interface ServiceFormData {
  name: string
  slug: string
  description: string
  moto: string
  imageUrl: string
  icon: string
}

interface ServiceFormProps {
  onSubmit: (data: ServiceFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<ServiceFormData> & { _id?: string }
  isSubmitting?: boolean
}

const ServiceForm = ({ 
  onSubmit, 
  onCancel, 
  initialData = {},
  isSubmitting = false 
}: ServiceFormProps): JSX.Element => {
  const [formData, setFormData] = useState<Omit<ServiceFormData, 'id'>>({
    name: initialData.name || "",
    slug: initialData.slug || "",
    description: initialData.description || "",
    moto: initialData.moto || "",
    imageUrl: initialData.imageUrl || "",
    icon: initialData.icon || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false)

  // Auto-generate slug from name
  useEffect(() => {
    if (!isSlugManuallyEdited && formData.name) {
      const generatedSlug = slugify(formData.name)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name, isSlugManuallyEdited])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required'
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof typeof newErrors]
        return newErrors
      })
    }
  }

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true)
    handleChange(e as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }

    // Call the onSubmit prop and handle the promise
    const submitPromise = Promise.resolve(onSubmit(formData))
    submitPromise
      .then(() => {
        toast.success(`Service ${initialData._id ? 'updated' : 'created'} successfully`)
      })
      .catch((error) => {
        console.error('Error submitting form:', error)
        toast.error(`Failed to ${initialData._id ? 'update' : 'create'} service`)
      })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {initialData._id ? "Edit Service" : "Add New Service"}
        </CardTitle>
        <CardDescription>
          {initialData._id 
            ? "Update the service details below"
            : "Fill in the details to create a new service"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="name">Service Name</Label>
              </div>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Cloud Computing"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Slug Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="slug">URL Slug</Label>
              </div>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                placeholder="e.g., cloud-computing"
                className={errors.slug ? 'border-red-500' : ''}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
            </div>

            {/* Moto Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📝</span>
                <Label htmlFor="moto">Tagline</Label>
              </div>
              <Input
                id="moto"
                name="moto"
                value={formData.moto}
                onChange={handleChange}
                placeholder="A short tagline for the service"
              />
            </div>

            {/* Icon Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🎨</span>
                <Label htmlFor="icon">Icon Name</Label>
              </div>
              <Input
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="e.g., cloud, server, database"
              />
            </div>
          </div>

          {/* Image URL Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="imageUrl">Image URL</Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
              />
              {formData.imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            {formData.imageUrl && (
              <div className="mt-2 rounded-md overflow-hidden max-w-xs">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  className="w-full h-auto rounded border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="description">Description</Label>
            </div>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the service..."
              rows={5}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData._id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{initialData._id ? 'Update Service' : 'Create Service'}</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ServiceForm