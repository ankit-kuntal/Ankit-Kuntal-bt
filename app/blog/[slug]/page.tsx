import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react'
import { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()
  const { data: blog } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${blog.title} | Blog`,
    description: blog.excerpt,
  }
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Simple markdown to HTML converter for basic formatting
function parseMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-4 text-foreground">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-6 text-foreground">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-muted rounded-lg p-4 my-6 overflow-x-auto"><code class="text-sm font-mono">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/50 pl-4 my-4 italic text-muted-foreground">$1</blockquote>')
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="my-8 border-border" />')
    // Paragraphs (wrap remaining text)
    .replace(/\n\n/gim, '</p><p class="mb-4 leading-relaxed text-foreground/90">')
    // Line breaks
    .replace(/\n/gim, '<br />')
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !blog) {
    notFound()
  }

  const readTime = estimateReadTime(blog.content)
  const htmlContent = parseMarkdown(blog.content)

  return (
    <article className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>

        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(blog.published_at || blog.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
            {blog.title}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {blog.excerpt}
          </p>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {blog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-sm bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {blog.cover_image && (
          <div className="mb-10 rounded-xl overflow-hidden">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: `<p class="mb-4 leading-relaxed text-foreground/90">${htmlContent}</p>`,
          }}
        />

        <footer className="mt-16 pt-8 border-t border-border">
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </footer>
      </div>
    </article>
  )
}
