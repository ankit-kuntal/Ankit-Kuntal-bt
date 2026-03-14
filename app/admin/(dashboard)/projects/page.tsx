import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProjectsTable } from './projects-table'

export default async function ProjectsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
      </div>
      <ProjectsTable initialProjects={projects || []} />
    </div>
  )
}
