import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProfileForm } from './settings-form'

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()

  const [aboutResult, socialLinksResult] = await Promise.all([
    supabase.from('about').select('*').single(),
    supabase.from('social_links').select('*').order('display_order', { ascending: true }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your portfolio profile and social links
        </p>
      </div>
    </div>
  )
}
