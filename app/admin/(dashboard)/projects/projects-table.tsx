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
import { Plus, Pencil, Trash2, ExternalLink, Github } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  image_url: string | null
  project_url: string | null
  github_url: string | null
  category: string
  technologies: string[]
  featured: boolean
  display_order: number
  created_at: string
}

type ProjectFormData = {
  title: string
  description: string
  image_url: string
  project_url: string
  github_url: string
  category: string
  technologies: string
  featured: boolean
  display_order: number
}

const defaultFormData: ProjectFormData = {
  title: '',
  description: '',
  image_url: '',
  project_url: '',
  github_url: '',
  category: '',
  technologies: '',
  featured: false,
  display_order: 0,
}

export function ProjectsTable({
  initialProjects,
}: {
  initialProjects: Project[]
}) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const openCreateDialog = () => {
    setEditingProject(null)
    setFormData(defaultFormData)
    setIsDialogOpen(true)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || '',
      project_url: project.project_url || '',
      github_url: project.github_url || '',
      category: project.category,
      technologies: project.technologies.join(', '),
      featured: project.featured,
      display_order: project.display_order,
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (project: Project) => {
    setDeletingProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const projectData = {
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url || null,
      project_url: formData.project_url || null,
      github_url: formData.github_url || null,
      category: formData.category,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      featured: formData.featured,
      display_order: formData.display_order,
    }

    try {
      if (editingProject) {
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
          .select()
          .single()

        if (error) throw error
        setProjects(
          projects.map((p) => (p.id === editingProject.id ? data : p))
        )
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single()

        if (error) throw error
        setProjects([...projects, data])
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingProject) return
    setIsLoading(true)

    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', deletingProject.id)

      if (error) throw error
      setProjects(projects.filter((p) => p.id !== deletingProject.id))
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead className="w-24">Featured</TableHead>
              <TableHead className="w-24">Links</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No projects yet. Add your first project to get started.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    {project.display_order}
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{project.category}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.featured ? (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 hover:text-primary"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openDeleteDialog(project)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? 'Edit Project' : 'Add Project'}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? 'Update your project details'
                : 'Add a new project to your portfolio'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Web App, Mobile App"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) =>
                  setFormData({ ...formData, technologies: e.target.value })
                }
                placeholder="React, TypeScript, Tailwind (comma separated)"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project_url">Project URL</Label>
                <Input
                  id="project_url"
                  type="url"
                  value={formData.project_url}
                  onChange={(e) =>
                    setFormData({ ...formData, project_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured on homepage</Label>
              </div>
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
                  : editingProject
                    ? 'Update Project'
                    : 'Add Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProject?.title}&quot;?
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
