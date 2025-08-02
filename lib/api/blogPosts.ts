const BASE_URL = "/api/blog-posts";

export async function getBlogPosts() {
  const res = await fetch(BASE_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function createBlogPost(data: any) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to create blog post');
  return result;
}

export async function updateBlogPost(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to update blog post');
  return result;
}

export async function deleteBlogPost(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE'
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Failed to delete blog post');
  return result;
}