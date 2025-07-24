"use client";
import React, { useEffect, useState } from "react";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/api/blogPosts";

const PAGE_SIZE = 5;

export default function BlogPostsCrud() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (e) {
      alert("Failed to fetch blog posts");
    }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createBlogPost({ title, content });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch {
      alert("Failed to create blog post");
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editId) return;
    try {
      await updateBlogPost(editId, { title, content });
      setEditId(null);
      setTitle("");
      setContent("");
      fetchPosts();
    } catch {
      alert("Failed to update blog post");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlogPost(id);
      fetchPosts();
    } catch {
      alert("Failed to delete blog post");
    }
  }

  function startEdit(post) {
    setEditId(post._id);
    setTitle(post.title);
    setContent(post.content);
  }

  // Filtering and pagination
  const filtered = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-1">Blog Posts</h2>
      <p className="text-gray-500 mb-4">
        Manage your blog posts. Search, paginate, edit, and delete.
      </p>
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <form onSubmit={editId ? handleUpdate : handleCreate} className="mb-4 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
          {editId ? "Update" : "Create"}
        </button>
        {editId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded border"
            onClick={() => {
              setEditId(null);
              setTitle("");
              setContent("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Title</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Content</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Tags</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Published</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Published At</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No blog posts found.</td>
              </tr>
            ) : (
              paginated.map((post) => (
                <tr key={post._id} className="border-t">
                  <td className="px-4 py-2">{post.title}</td>
                  <td className="px-4 py-2">{post.content}</td>
                  <td className="px-4 py-2">
                    {post.tags && post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 text-gray-700 rounded-full px-2 py-1 text-xs mr-1 mb-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block w-10 text-center rounded-full px-2 py-1 text-xs font-bold ${
                        post.published ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {post.published ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600"
                        onClick={() => startEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            className="border rounded px-2 py-1"
            value={PAGE_SIZE}
            disabled
          >
            <option value={5}>5</option>
          </select>
          <span>per page</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            &laquo;
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &lt;
          </button>
          <span>
            {page} of {totalPages}
          </span>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            &gt;
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            &raquo;
          </button>
        </div>
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} results
        </span>
      </div>
    </div>
  );
}
