// app/admin/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, FileText, Share2, TrendingUp, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()

  // Data fetching for all sections
  const [projectsResult, blogsResult, socialResult] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact' }),
    supabase.from('blogs').select('*', { count: 'exact' }),
    supabase.from('social_links').select('*', { count: 'exact' }),
  ])

  const projectsCount = projectsResult.count || 0
  const blogsCount = blogsResult.count || 0
  const socialCount = socialResult.count || 0
  
  const featuredProjects = projectsResult.data?.filter((p) => p.published)?.length || 0
  const publishedBlogs = blogsResult.data?.filter((b) => b.published)?.length || 0

  const stats = [
    {
      title: 'Total Projects',
      value: projectsCount,
      description: `${featuredProjects} live projects`,
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      title: 'Blog Posts',
      value: blogsCount,
      description: `${publishedBlogs} published articles`,
      icon: FileText,
      href: '/admin/blogs',
    },
    {
      title: 'Social Presence',
      value: socialCount,
      description: 'Active social links',
      icon: Share2,
      href: '/admin/links-manage', // New Link Manager route
    },
    {
      title: 'Performance',
      value: featuredProjects + publishedBlogs,
      description: 'Total live items',
      icon: TrendingUp,
      href: '/admin/projects',
    },
    {
      title: 'Settings',
      value: 'Profile',
      description: 'Update Bio & Avatar',
      icon: Settings,
      href: '/admin/settings',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your portfolio and content management
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-all hover:shadow-md hover:bg-muted/30">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Projects Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest work added to portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsResult.data && projectsResult.data.length > 0 ? (
              <div className="space-y-4">
                {projectsResult.data.slice(0, 5).map((project) => (
                  <div key={project.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.category}</p>
                    </div>
                    {project.published && (
                      <span className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        Live
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No projects found.</p>
            )}
          </CardContent>
        </Card>

        {/* Social Links Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Platforms</CardTitle>
            <CardDescription>Manage your social media visibility</CardDescription>
          </CardHeader>
          <CardContent>
            {socialResult.data && socialResult.data.length > 0 ? (
              <div className="space-y-4">
                {socialResult.data.slice(0, 5).map((link) => (
                  <div key={link.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{link.platform}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">{link.url}</p>
                    </div>
                    <Link href="/admin/links-manage" className="text-[10px] text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No social links added.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}