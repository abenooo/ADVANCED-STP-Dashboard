const BASE_URL = "/api/blog-posts";

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export async function getBlogPosts() {
  const res = await fetch(BASE_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function createBlogPost(data: any) {
  const token = getAuthToken();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to create blog post');
  return result;
}

export async function updateBlogPost(id: string, data: any) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to update blog post');
  return result;
}

export async function deleteBlogPost(id: string) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to delete blog post');
  return result;
}