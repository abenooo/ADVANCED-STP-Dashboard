"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchBlogPosts } from "@/lib/api/blogPosts";

export default function BlogPostsCrud() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-start py-16 px-4">
      <h1 className="text-5xl font-extrabold text-orange-500 mb-2 text-center">Blog Posts</h1>
      <p className="text-gray-400 text-lg mb-10 text-center">
        Manage your blog posts. Add, edit, or remove posts below.
      </p>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {loading ? (
          <div className="text-gray-300 text-center">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-gray-400 text-center">No blog posts found.</div>
        ) : (
          posts.map((post) => (
            <Card
              key={post._id}
              className="border border-neutral-800 bg-neutral-900 rounded-2xl shadow p-0 transition-colors hover:border-orange-500/50"
            >
              <CardHeader>
                <div className="text-2xl font-bold text-white mb-1">{post.title}</div>
                <div className="text-gray-300 mb-1">
                  <span className="font-medium">Slug:</span> {post.slug}
                </div>
                <div className="text-gray-400 mb-2">
                  {post.publishedAt
                    ? "Published: " + new Date(post.publishedAt).toLocaleDateString()
                    : "Draft"}
                </div>
                <div className="text-white text-base mb-4">{post.content}</div>
                <div className="flex gap-3 mb-5 justify-end">
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
                  >
                    Delete
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
