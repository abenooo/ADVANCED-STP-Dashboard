"use client";
import React, { useEffect, useState } from "react";
import {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/lib/api/blogPosts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, X, Calendar, Clock, FileText, Tag } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  tags?: string[];
}

export default function BlogPostsCrud() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const data: BlogPost[] = await getBlogPosts();
      setBlogPosts(data);
    } catch (e) {
      const error = e as Error;
      alert("Failed to fetch blog posts: " + (error.message || String(e)));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const newPost: Omit<BlogPost, '_id'> = { 
        title, 
        content, 
        slug,
        publishedAt: new Date().toISOString()
      };
      await createBlogPost(newPost);
      resetForm();
      fetchPosts();
    } catch (e) {
      console.error("Create error:", e);
      alert("Failed to create blog post");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    try {
      const updatedPost: Partial<BlogPost> = { 
        title, 
        content, 
        slug,
        updatedAt: new Date().toISOString()
      };
      await updateBlogPost(editId, updatedPost);
      resetForm();
      fetchPosts();
    } catch (e) {
      console.error("Update error:", e);
      alert("Failed to update blog post");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await deleteBlogPost(id);
      fetchPosts();
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete blog post");
    }
  }

  function startEdit(post: BlogPost) {
    setEditId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setSlug(post.slug);
    setShowModal(true);
  }

  function resetForm() {
    setEditId(null);
    setTitle("");
    setContent("");
    setSlug("");
    setShowModal(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Blog Posts</h1>
        <p className="text-muted-foreground">Manage all blog posts and content.</p>
      </div>
      
      {/* Create/Edit Form */}
      <Card className={`mb-8 ${!showModal ? 'hidden' : ''}`}>
        <CardHeader>
          <CardTitle>{editId ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
          <CardDescription>
            {editId ? 'Update the blog post details below' : 'Fill in the details to create a new blog post'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={editId ? handleUpdate : handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="blog-title">
                Title
              </label>
              <input
                id="blog-title"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter blog post title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="blog-slug">
                Slug
              </label>
              <input
                id="blog-slug"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter URL-friendly slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="blog-content">
                Content
              </label>
              <textarea
                id="blog-content"
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your blog post content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit">
                {editId ? (
                  <>
                    <Pencil className="mr-2 h-4 w-4" />
                    Update Post
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>



      {/* Blog Posts List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">All Blog Posts</h2>
            <p className="text-sm text-muted-foreground">
              {blogPosts.length} {blogPosts.length === 1 ? 'post' : 'posts'} found
            </p>
          </div>
          <Button
            onClick={() => {
              setShowModal(true);
              resetForm();
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : blogPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">No blog posts yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first blog post.
              </p>
              <Button 
                onClick={() => {
                  setShowModal(true);
                  resetForm();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {blogPosts.map((post) => (
              <Card key={post._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span className="font-mono bg-muted px-2 py-0.5 rounded text-xs">
                          /{post.slug}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => startEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(post._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="line-clamp-3 text-sm text-muted-foreground mb-4">
                    {post.content}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-4 pt-0 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    {post.publishedAt ? (
                      <>Published {new Date(post.publishedAt).toLocaleDateString()}</>
                    ) : (
                      'Draft'
                    )}
                  </div>
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <div className="flex items-center">
                      <Clock className="mr-1.5 h-4 w-4" />
                      Updated {new Date(post.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
