export interface Contact {
  _id: string
  fullName: string
  email: string
  companyName?: string
  description?: string
  source?: string
  status?: string
  processedBy?: string | null
  createdAt: string
  updatedAt: string
}

export interface ContactsResponse {
  success: boolean
  message?: string
  data: Contact[]
  count?: number
}

// Use Next API proxy which attaches Authorization from cookies/header
export async function getContacts(): Promise<ContactsResponse> {
  const res = await fetch('/api/contacts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch contacts')
  }
  // Backend returns { success, data: Contact[] } typically
  return data
}
