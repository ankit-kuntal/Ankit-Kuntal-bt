'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Save, GripVertical } from 'lucide-react'

type About = {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  resume_url: string | null
  email: string | null
  location: string | null
}

type SocialLink = {
  id: string
  platform: string
  url: string
  icon: string
  display_order: number
}

type SocialLinkFormData = {
  platform: string
  url: string
  icon: string
  display_order: number
}

const defaultSocialLinkFormData: SocialLinkFormData = {
  platform: '',
  url: '',
  icon: '',
  display_order: 0,
}

export function SettingsForm({
  initialAbout,
  initialSocialLinks,
}: {
  initialAbout: About | null
  initialSocialLinks: SocialLink[]
}) {
  const [about, setAbout] = useState<About | null>(initialAbout)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks)
  const [aboutForm, setAboutForm] = useState({
    name: about?.name || '',
    title: about?.title || '',
    bio: about?.bio || '',
    avatar_url: about?.avatar_url || '',
    resume_url: about?.resume_url || '',
    email: about?.email || '',
    location: about?.location || '',
  })
  const [isAboutLoading, setIsAboutLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [deletingLink, setDeletingLink] = useState<SocialLink | null>(null)
  const [linkFormData, setLinkFormData] = useState<SocialLinkFormData>(defaultSocialLinkFormData)
  const [isLinkLoading, setIsLinkLoading] = useState(false)
  const router = useRouter()

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAboutLoading(true)

    const supabase = createClient()
    const aboutData = {
      name: aboutForm.name,
      title: aboutForm.title,
      bio: aboutForm.bio,
      avatar_url: aboutForm.avatar_url || null,
      resume_url: aboutForm.resume_url || null,
      email: aboutForm.email || null,
      location: aboutForm.location || null,
    }

    try {
      if (about) {
        const { data, error } = await supabase
          .from('about')
          .update(aboutData)
          .eq('id', about.id)
          .select()
          .single()

        if (error) throw error
        setAbout(data)
      } else {
        const { data, error } = await supabase
          .from('about')
          .insert(aboutData)
          .select()
          .single()

        if (error) throw error
        setAbout(data)
      }
      router.refresh()
    } catch (error) {
      console.error('Error saving about:', error)
    } finally {
      setIsAboutLoading(false)
    }
  }

  const openCreateLinkDialog = () => {
    setEditingLink(null)
    setLinkFormData({
      ...defaultSocialLinkFormData,
      display_order: socialLinks.length,
    })
    setIsDialogOpen(true)
  }

  const openEditLinkDialog = (link: SocialLink) => {
    setEditingLink(link)
    setLinkFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      display_order: link.display_order,
    })
    setIsDialogOpen(true)
  }

  const openDeleteLinkDialog = (link: SocialLink) => {
    setDeletingLink(link)
    setIsDeleteDialogOpen(true)
  }

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLinkLoading(true)

    const supabase = createClient()
    const linkData = {
      platform: linkFormData.platform,
      url: linkFormData.url,
      icon: linkFormData.icon,
      display_order: linkFormData.display_order,
    }

    try {
      if (editingLink) {
        const { data, error } = await supabase
          .from('social_links')
          .update(linkData)
          .eq('id', editingLink.id)
          .select()
          .single()

        if (error) throw error
        setSocialLinks(socialLinks.map((l) => (l.id === editingLink.id ? data : l)))
      } else {
        const { data, error } = await supabase
          .from('social_links')
          .insert(linkData)
          .select()
          .single()

        if (error) throw error
        setSocialLinks([...socialLinks, data])
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error saving social link:', error)
    } finally {
      setIsLinkLoading(false)
    }
  }

  const handleDeleteLink = async () => {
    if (!deletingLink) return
    setIsLinkLoading(true)

    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', deletingLink.id)

      if (error) throw error
      setSocialLinks(socialLinks.filter((l) => l.id !== deletingLink.id))
      setIsDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error deleting social link:', error)
    } finally {
      setIsLinkLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information displayed on your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAboutSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={aboutForm.name}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={aboutForm.title}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, title: e.target.value })
                  }
                  placeholder="e.g., Full-Stack Developer"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={aboutForm.bio}
                onChange={(e) =>
                  setAboutForm({ ...aboutForm, bio: e.target.value })
                }
                placeholder="Tell visitors about yourself..."
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={aboutForm.email}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, email: e.target.value })
                  }
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={aboutForm.location}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, location: e.target.value })
                  }
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  value={aboutForm.avatar_url}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, avatar_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume_url">Resume URL</Label>
                <Input
                  id="resume_url"
                  type="url"
                  value={aboutForm.resume_url}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, resume_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isAboutLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isAboutLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Manage your social media and contact links
            </CardDescription>
          </div>
          <Button size="sm" onClick={openCreateLinkDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No social links yet. Add your first link to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {socialLinks
                .sort((a, b) => a.display_order - b.display_order)
                .map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{link.platform}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditLinkDialog(link)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openDeleteLinkDialog(link)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? 'Edit Social Link' : 'Add Social Link'}
            </DialogTitle>
            <DialogDescription>
              {editingLink
                ? 'Update your social link details'
                : 'Add a new social media or contact link'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLinkSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Input
                id="platform"
                value={linkFormData.platform}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, platform: e.target.value })
                }
                placeholder="e.g., GitHub, LinkedIn, Twitter"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={linkFormData.url}
                onChange={(e) =>
                  setLinkFormData({ ...linkFormData, url: e.target.value })
                }
                placeholder="https://..."
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={linkFormData.icon}
                  onChange={(e) =>
                    setLinkFormData({ ...linkFormData, icon: e.target.value })
                  }
                  placeholder="e.g., github, linkedin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={linkFormData.display_order}
                  onChange={(e) =>
                    setLinkFormData({
                      ...linkFormData,
                      display_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
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
              <Button type="submit" disabled={isLinkLoading}>
                {isLinkLoading
                  ? 'Saving...'
                  : editingLink
                    ? 'Update Link'
                    : 'Add Link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the {deletingLink?.platform} link?
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
              onClick={handleDeleteLink}
              disabled={isLinkLoading}
            >
              {isLinkLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
