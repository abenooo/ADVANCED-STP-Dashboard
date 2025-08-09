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

export async function updateContactStatus(id: string, status: 'new' | 'reviewed' | 'contacted' | 'archived') {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Failed to update contact')
  return data
}

export async function deleteContact(id: string) {
  const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.message || 'Failed to delete contact')
  return data
}
// Use Next API proxy which attaches Authorization from cookies/header
export async function getContacts(): Promise<ContactsResponse> {
  const res = await fetch('/api/contacts', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.message || 'Failed to fetch contacts')
  return data
}
