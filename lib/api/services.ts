import { getAuthHeaders } from '@/lib/utils/auth';

const BASE_URL = "/api/services"

export interface Service {
  _id: string
  name: string
  slug: string
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
  const res = await fetch(BASE_URL, { 
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
      'Content-Type': 'application/json',
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
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.error || 'Failed to delete sub-service')
  return result
}
