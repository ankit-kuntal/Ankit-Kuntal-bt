import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, FileText, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const [projectsResult, blogsResult] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact' }),
    supabase.from('blogs').select('*', { count: 'exact' }),
  ])

  const projectsCount = projectsResult.count || 0
  const blogsCount = blogsResult.count || 0
  const featuredProjects = projectsResult.data?.filter((p) => p.featured)?.length || 0
  const publishedBlogs = blogsResult.data?.filter((b) => b.published)?.length || 0

  const stats = [
    {
      title: 'Total Projects',
      value: projectsCount,
      description: `${featuredProjects} featured`,
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      title: 'Blog Posts',
      value: blogsCount,
      description: `${publishedBlogs} published`,
      icon: FileText,
      href: '/admin/blogs',
    },
    {
      title: 'Featured Items',
      value: featuredProjects,
      description: 'Projects on homepage',
      icon: TrendingUp,
      href: '/admin/projects',
    },
    {
      title: 'Profile Settings',
      value: '1',
      description: 'About & social links',
      icon: Users,
      href: '/admin/settings',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your portfolio admin panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest portfolio projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsResult.data && projectsResult.data.length > 0 ? (
              <div className="space-y-4">
                {projectsResult.data.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {project.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {project.category}
                      </p>
                    </div>
                    {project.featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No projects yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>Your latest articles</CardDescription>
          </CardHeader>
          <CardContent>
            {blogsResult.data && blogsResult.data.length > 0 ? (
              <div className="space-y-4">
                {blogsResult.data.slice(0, 5).map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {blog.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {blog.category}
                      </p>
                    </div>
                    {blog.published ? (
                      <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No blog posts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
