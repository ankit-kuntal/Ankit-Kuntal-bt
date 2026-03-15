import { createSupabaseServerClient } from '@/lib/supabase/server'
import { SocialLinksManager } from './links-manager' // Usi folder ki client file

export default async function SocialLinksPage() {
  const supabase = await createSupabaseServerClient()

  // Sirf Social Links ka data fetch ho raha hai
  const { data: socialLinks, error } = await supabase
    .from('social_links')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching links:', error)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Social Media Links</h2>
        <p className="text-muted-foreground">
          Update your social presence. Icons and animations are managed automatically.
        </p>
      </div>

      <div className="border-t pt-6">
        {/* Independent Manager */}
        <SocialLinksManager initialSocialLinks={socialLinks || []} />
      </div>
    </div>
  )
}