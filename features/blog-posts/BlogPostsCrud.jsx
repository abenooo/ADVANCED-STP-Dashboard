"use client";
import React, { useEffect, useState } from "react";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/api/blogPosts";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BlogPostsCrud() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data = await getBlogPosts();
      setBlogPosts(data);
    } catch (e) {
      alert("Failed to fetch blog posts: " + (e.message || e));
    }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createBlogPost({ title, content, slug });
      setTitle("");
      setContent("");
      setSlug("");
      fetchPosts();
    } catch {
      alert("Failed to create blog post");
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editId) return;
    try {
      await updateBlogPost(editId, { title, content, slug });
      setEditId(null);
      setTitle("");
      setContent("");
      setSlug("");
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
    setSlug(post.slug);
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-start py-16 px-4">
      <p className="text-gray-400 text-lg mb-10 text-center">
        Manage your blog posts. Add, edit, or remove blog posts below.
      </p>
      <form
        onSubmit={editId ? handleUpdate : handleCreate}
        className="w-full max-w-xl mb-8 bg-neutral-800 rounded-2xl shadow p-8 space-y-6"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-orange-500 mb-1">Blog Posts</h2>
          <p className="text-gray-400 text-base mb-4">
            Manage your blog posts. Add, edit, or remove blog posts below.
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="blog-title">
              Title
            </label>
            <input
              id="blog-title"
              className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter blog post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="blog-slug">
              Slug
            </label>
            <input
              id="blog-slug"
              className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter blog post slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="blog-content">
              Content
            </label>
            <textarea
              id="blog-content"
              className="border border-neutral-700 bg-neutral-900 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter blog post content"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
            type="submit"
          >
            {editId ? "Update" : "Create"}
          </button>
          {editId && (
            <button
              type="button"
              className="px-6 py-2 rounded border border-neutral-700 text-gray-300 font-semibold transition"
              onClick={() => {
                setEditId(null);
                setTitle("");
                setContent("");
                setSlug("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full text-gray-300 text-center">Loading...</div>
        ) : blogPosts.length === 0 ? (
          <div className="col-span-full text-gray-400 text-center">No blog posts found.</div>
        ) : (
          blogPosts.map(post => (
            <Card
              key={post._id}
              className="border border-neutral-800 bg-neutral-900 rounded-xl shadow p-0 mb-5 flex flex-col h-full transition-colors hover:border-orange-500/50"
            >
              <CardHeader>
                <div className="text-xs text-gray-400 mb-2">
                  Published: {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft"}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{post.title}</div>
                <div className="text-sm text-white mb-2">Slug: {post.slug}</div>
              </CardHeader>
              <div className="px-6 pb-6 flex flex-col flex-1">
                <div className="text-white text-base mb-4">{post.content}</div>
                {/* Tags if available */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-500/20 text-orange-500 rounded-full px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {/* Dates */}
                <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
                  <span>
                    <span className="font-semibold text-gray-300">Created:</span>{" "}
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
                  </span>
                  <span>
                    <span className="font-semibold text-gray-300">Updated:</span>{" "}
                    {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "-"}
                  </span>
                </div>
                {/* Actions */}
                <div className="flex gap-3 mb-5 justify-end">
                  <Button
                    onClick={() => startEdit(post)}
                    variant="outline"
                    className="mt-4 w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(post._id)}
                    variant="outline"
                    className="mt-4 w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}