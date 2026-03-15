'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save, Plus, Trash2, Loader2, Rocket } from 'lucide-react'

export function AboutManager({ initialAbout }: { initialAbout: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  // State initialization
  const [formData, setFormData] = useState({
    bio: initialAbout?.bio || '',
    years_experience: initialAbout?.years_experience || 0,
    projects_shipped: initialAbout?.projects_shipped || 0,
  })

  const [capabilities, setCapabilities] = useState<{point: string}[]>(
    initialAbout?.what_i_do || [{ point: '' }]
  )

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    try {
      const finalCapabilities = capabilities.filter(p => p.point.trim() !== '')
      const payload = { ...formData, what_i_do: finalCapabilities }

      if (initialAbout?.id) {
        // UPDATE LOGIC: Agar row pehle se hai
        const { error } = await supabase.from('about').update(payload).eq('id', initialAbout.id)
        if (error) throw error
      } else {
        // INSERT LOGIC: Agar database khali hai
        const { error } = await supabase.from('about').insert([payload])
        if (error) throw error
      }
      
      alert("Profile Saved Successfully!")
      router.refresh()
      window.location.reload() // UI refresh ke liye
    } catch (err: any) {
      alert("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-lg border-blue-500/20">
      <CardHeader className="bg-blue-500/5">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5 text-blue-500" />
          <CardTitle>{initialAbout?.id ? "Edit Profile" : "Create Your Profile"}</CardTitle>
        </div>
        <CardDescription>Yahan se aap bio, experience aur skills manage kar sakte hain.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-bold">Main Bio / Heading</Label>
            <Textarea 
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})}
              placeholder="Hi, I am Ankit. I build cool things..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold">Years Experience</Label>
              <Input type="number" value={formData.years_experience} onChange={e => setFormData({...formData, years_experience: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <Label className="font-bold">Projects Shipped</Label>
              <Input type="number" value={formData.projects_shipped} onChange={e => setFormData({...formData, projects_shipped: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="font-bold">What I Do (Capabilities)</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setCapabilities([...capabilities, { point: '' }])}>
                <Plus className="h-4 w-4 mr-1" /> Add Skill
              </Button>
            </div>
            {capabilities.map((cap, index) => (
              <div key={index} className="flex gap-2">
                <Input value={cap.point} onChange={e => {
                  const newPoints = [...capabilities];
                  newPoints[index].point = e.target.value;
                  setCapabilities(newPoints);
                }} placeholder="e.g. Next.js Development" required />
                <Button type="button" variant="ghost" size="icon" disabled={capabilities.length === 1} onClick={() => setCapabilities(capabilities.filter((_, i) => i !== index))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />} 
            {initialAbout?.id ? "Update Profile" : "Create Profile Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}