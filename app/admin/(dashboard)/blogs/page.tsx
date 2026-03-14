import { createSupabaseServerClient } from '@/lib/supabase/server'
import { BlogsTable } from './blogs-table'

export default async function BlogsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blogs:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">
            Manage your blog articles
          </p>
        </div>
      </div>
      <BlogsTable initialBlogs={blogs || []} />
    </div>
  )
}
