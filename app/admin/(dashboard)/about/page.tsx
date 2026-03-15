import { createSupabaseServerClient } from '@/lib/supabase/server'
import { AboutManager } from './about-manage'

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch data
  const { data: aboutData } = await supabase
    .from('about')
    .select('*')
    .maybeSingle() // Single use kiya taaki 0 rows par error na aaye

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Portfolio Settings</h2>
        <p className="text-muted-foreground">Apni professional details yahan se control karein.</p>
      </div>

      {/* Form hamesha render hoga, chahe data ho ya na ho */}
      <AboutManager initialAbout={aboutData} />
    </div>
  )
}