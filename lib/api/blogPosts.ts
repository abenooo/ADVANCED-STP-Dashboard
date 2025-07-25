// lib/api/blogPosts.ts
const BASE_URL = "/api/blog-posts";

export async function getBlogPosts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function createBlogPost(data: any) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create blog post");
  return res.json();
}

// For update and delete, you need to implement the proxy in your API route as well
export async function updateBlogPost(id: any, data: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update blog post");
  return res.json();
}

export async function deleteBlogPost(id: any) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete blog post");
  return res.json();
}