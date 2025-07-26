const BASE_URL = "/api/admin-users";

// Get token from cookies
function getToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  return match ? match[2] : null;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const token = getToken();
  const res = await fetch(BASE_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function createAdminUser(user: Omit<AdminUser, '_id' | 'createdAt' | 'updatedAt'>) {
  const token = getToken();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create user');
  }
  return res.json();
}

export async function updateAdminUser(id: string, user: Partial<AdminUser>) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify(user)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update user');
  }
  return res.json();
}

export async function deleteAdminUser(id: string) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  return res.json();
}
