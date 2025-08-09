import { getAuthHeaders } from '@/lib/utils/auth';

const BASE_URL = "/api/services"
// For public GETs, use Render API directly as requested
const PUBLIC_API_BASE = 'https://advacned-tsp.onrender.com/api'

export interface Service {
  _id: string
  name: string
  slug: string
  // Some API responses may use `serviceSlug` instead of `slug`
  serviceSlug?: string
  description: string
  moto: string
  imageUrl: string
  icon: string
  subServices: SubService[]
  subService?: SubService[] // Add this optional field
  __v: number
  createdAt: string
  updatedAt: string
}

export interface SubService {
  _id: string
  subServiceName: string
  slug: string
  // Some API responses may use `subServiceSlug` instead of `slug`
  subServiceSlug?: string
  moto: string
  definition: string
  commitment: string
  organizationNeed: OrganizationNeed
  businessValue: BusinessValue
  cta: CTA
}

export interface OrganizationNeed {
  organizationalDefinition: string
  needs: Need[]
}

export interface BusinessValue {
  businessValueDefinition: string
  values: Value[]
}

export interface Need {
  _id: string
  title: string
  description: string
}

export interface Value {
  _id: string
  title: string
  description: string
}

export interface CTA {
  _id: string
  title: string
  description: string
}

// Response type for the services API
export interface ServicesResponse {
  success: boolean;
  data: Service[];
  count: number;
}

// Public - no authentication required
export async function getServices(): Promise<ServicesResponse> {
  const res = await fetch(`${PUBLIC_API_BASE}/services`, { 
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch services');
  }
  
  return res.json();
}

// Public - get service by slug (matches Express: GET /api/services/:slug)
export async function getServiceBySlug(slug: string): Promise<{ success: boolean; data: Service }>{
  // Call Render API directly (public GET)
  const res = await fetch(`${PUBLIC_API_BASE}/services/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to fetch service')
  }
  return res.json()
}

// Public - list sub-services for a service
export async function getSubServices(serviceId: string): Promise<{ success: boolean; data: SubService[] }>{
  const res = await fetch(`${BASE_URL}/${serviceId}/sub-services`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to fetch sub-services')
  }
  return res.json()
}

// Public - get a single sub-service by slugs (matches Express: GET /api/services/:serviceSlug/:subServiceSlug)
export async function getSubServiceBySlugs(serviceSlug: string, subServiceSlug: string): Promise<{ success: boolean; data: { service: Service; subService: SubService } }>{
  // Call Render API directly (public GET)
  const res = await fetch(`${PUBLIC_API_BASE}/services/${encodeURIComponent(serviceSlug)}/${encodeURIComponent(subServiceSlug)}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to fetch sub-service')
  }
  return res.json()
}

// Deprecated: id-based internal route kept for backward compatibility
export async function getSubService(serviceId: string, subServiceId: string): Promise<{ success: boolean; data: SubService }>{
  const res = await fetch(`${BASE_URL}/${serviceId}/sub-services/${subServiceId}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'Failed to fetch sub-service')
  }
  return res.json()
}

// Protected - requires authentication
export async function createService(data: Partial<Service>): Promise<Service> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || 'Failed to create service');
  }
  
  return result.data;
}

// Protected - requires authentication
export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || 'Failed to update service');
  }
  
  return result.data;
}

// Protected - requires authentication
export async function deleteService(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.error || 'Failed to delete service');
  }
  
  return { success: true };
}

// Sub-service CRUD operations
export async function createSubService(serviceId: string, data: Partial<SubService>): Promise<Service> {
  const response = await fetch(`/api/services/${serviceId}/sub-services`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create sub-service');
  }

  return response.json();
}

export async function updateSubService(serviceId: string, subServiceId: string, data: Partial<SubService>): Promise<SubService> {
  const res = await fetch(`/api/services/${serviceId}/sub-services/${subServiceId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Failed to update sub-service')
  return result
}

export async function deleteSubService(serviceId: string, subServiceId: string): Promise<void> {
  const res = await fetch(`/api/services/${serviceId}/sub-services/${subServiceId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Failed to delete sub-service')
  return result
}
