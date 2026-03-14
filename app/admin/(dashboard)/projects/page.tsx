import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ProjectsTable } from './projects-table'

export default async function ProjectsPage() {
  const supabase = createSupabaseServerClient()

  // Fetch projects from Supabase
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
  }

  // Ensure each project has tags as array
  const formattedProjects = (projects || []).map((project) => ({
    ...project,
    tags: Array.isArray(project.tags) ? project.tags : [],
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
      </div>

      {/* Pass formatted projects to table */}
      <ProjectsTable initialProjects={formattedProjects} />
    </div>
  )
}