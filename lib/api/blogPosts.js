const BASE_URL = "https://advacned-tsp.onrender.com/api/blog-posts";

export async function getBlogPosts() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function createBlogPost(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create blog post");
  return res.json();
}

export async function updateBlogPost(id, data) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update blog post");
  return res.json();
}

export async function deleteBlogPost(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete blog post");
  return res.json();
}
