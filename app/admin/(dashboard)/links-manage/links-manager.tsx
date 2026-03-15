// app/admin/links-manage/links-manager.tsx
'use client'

import { useState, useEffect } from 'react' // useEffect add kiya data sync ke liye
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'

export function SocialLinksManager({ initialSocialLinks }: { initialSocialLinks: any[] }) {
  const [links, setLinks] = useState(initialSocialLinks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<any | null>(null)
  const [formData, setFormData] = useState({ platform: '', url: '', display_order: 0 })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Jab backend se naya data aaye toh state update ho
  useEffect(() => {
    setLinks(initialSocialLinks)
  }, [initialSocialLinks])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    try {
      if (editingLink) {
        await supabase.from('social_links').update(formData).eq('id', editingLink.id)
      } else {
        await supabase.from('social_links').insert(formData)
      }
      setIsDialogOpen(false)
      router.refresh()
    } catch (err) {
        console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('social_links').delete().eq('id', id)
    if (!error) router.refresh()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Icon aur design automatically front-end par apply honge.</CardDescription>
        </div>
        <Button size="sm" onClick={() => { setEditingLink(null); setFormData({ platform: '', url: '', display_order: links.length }); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <GripVertical className="text-muted-foreground" size={16} />
              <span className="font-semibold">{link.platform}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => { setEditingLink(link); setFormData({ platform: link.platform, url: link.url, display_order: link.display_order }); setIsDialogOpen(true); }}>
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
                <Trash2 size={16} className="text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSave} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editingLink ? 'Edit Link' : 'Add Link'}</DialogTitle>
              <DialogDescription>Bas platform name sahi likhna (e.g., 'Github').</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}