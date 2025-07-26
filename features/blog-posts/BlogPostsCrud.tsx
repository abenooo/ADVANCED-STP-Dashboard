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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    slug: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        ...formData,
        publishedAt: new Date().toISOString()
      };
      await createBlogPost(newPost);
      setIsDialogOpen(false);
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
        ...formData,
        updatedAt: new Date().toISOString()
      };
      await updateBlogPost(editId, updatedPost);
      setIsDialogOpen(false);
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
    setFormData({
      title: post.title,
      content: post.content,
      slug: post.slug,
    });
    setIsDialogOpen(true);
  }

  function resetForm() {
    setEditId(null);
    setFormData({
      title: "",
      content: "",
      slug: "",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Blog Posts</h1>
        <p className="text-muted-foreground">Manage all blog posts and content.</p>
      </div>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          setEditId(null);
        }
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editId ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            <DialogDescription>
              {editId ? 'Update the blog post details below' : 'Fill in the details to create a new blog post'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editId ? handleUpdate : handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter blog post title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug
              </Label>
              <Input
                id="slug"
                name="slug"
                placeholder="Enter URL-friendly slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">
                Content
              </Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your blog post content here..."
                value={formData.content}
                onChange={handleInputChange}
                className="min-h-[300px]"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setEditId(null);
                  setIsDialogOpen(false);
                }}
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>



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
              resetForm();
              setEditId(null);
              setIsDialogOpen(true);
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
                  resetForm();
                  setEditId(null);
                  setIsDialogOpen(true);
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
