'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react'

type Blog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string | null
  category: string
  tags: string[]
  published: boolean
  published_at: string | null
  created_at: string
}

type BlogFormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tags: string
  published: boolean
}

const defaultFormData: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category: '',
  tags: '',
  published: false,
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function BlogsTable({ initialBlogs }: { initialBlogs: Blog[] }) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null)
  const [formData, setFormData] = useState<BlogFormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const openCreateDialog = () => {
    setEditingBlog(null)
    setFormData(defaultFormData)
    setIsDialogOpen(true)
  }

  const openEditDialog = (blog: Blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image: blog.cover_image || '',
      category: blog.category,
      tags: blog.tags.join(', '),
      published: blog.published,
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (blog: Blog) => {
    setDeletingBlog(blog)
    setIsDeleteDialogOpen(true)
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingBlog ? formData.slug : generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const blogData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      cover_image: formData.cover_image || null,
      category: formData.category,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      published: formData.published,
      published_at: formData.published ? new Date().toISOString() : null,
    }

    try {
      if (editingBlog) {
        const { data, error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id)
          .select()
          .single()

        if (error) throw error
        setBlogs(blogs.map((b) => (b.id === editingBlog.id ? data : b)))
      } else {
        const { data, error } = await supabase
          .from('blogs')
          .insert(blogData)
          .select()
          .single()

        if (error) throw error
        setBlogs([data, ...blogs])
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving blog:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingBlog) return
    setIsLoading(true)

    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', deletingBlog.id)

      if (error) throw error
      setBlogs(blogs.filter((b) => b.id !== deletingBlog.id))
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting blog:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePublished = async (blog: Blog) => {
    const supabase = createClient()
    const newPublished = !blog.published

    try {
      const { data, error } = await supabase
        .from('blogs')
        .update({
          published: newPublished,
          published_at: newPublished ? new Date().toISOString() : null,
        })
        .eq('id', blog.id)
        .select()
        .single()

      if (error) throw error
      setBlogs(blogs.map((b) => (b.id === blog.id ? data : b)))
      router.refresh()
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blog Post
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Published</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No blog posts yet. Write your first article to get started.
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{blog.title}</p>
                      <p className="text-xs text-muted-foreground">
                        /{blog.slug}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{blog.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="text-xs text-muted-foreground">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => togglePublished(blog)}
                      className="inline-flex items-center gap-1"
                    >
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600 dark:text-green-400">
                          <Eye className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-600 dark:text-yellow-400">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(blog.published_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {blog.published && (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(blog)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openDeleteDialog(blog)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? 'Edit Blog Post' : 'Add Blog Post'}
            </DialogTitle>
            <DialogDescription>
              {editingBlog
                ? 'Update your blog post'
                : 'Write a new blog article'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Tutorial, Guide"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="React, Next.js (comma separated)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="A brief summary of the post..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your blog post content in Markdown..."
                className="min-h-[200px] font-mono text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                type="url"
                value={formData.cover_image}
                onChange={(e) =>
                  setFormData({ ...formData, cover_image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : editingBlog
                    ? 'Update Post'
                    : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingBlog?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
