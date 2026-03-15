// app/page.tsx
import { Metadata } from 'next'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Dev | Full-Stack Developer Portfolio',
  description: 'Discover Dev’s software products, projects, blog and contact info.',
  keywords: ['Dev', 'full-stack developer', 'portfolio', 'web developer', 'React', 'Next.js', 'Supabase'],
  openGraph: {
    title: 'Dev | Full-Stack Developer Portfolio',
    description: 'Discover Dev’s software products, projects, blog and contact info.',
    url: 'https://ankit-kuntal-bt.vercel.app/',
    siteName: 'Dev Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dev | Full-Stack Developer Portfolio',
    description: 'Discover Dev’s software products, projects, blog and contact info.',
  },
}

import { Navbar } from "@/components/portfolio/navbar"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { TechStack } from "@/components/portfolio/tech-stack"
import { Projects } from "@/components/portfolio/projects"
import { Writing } from "@/components/portfolio/writing"
import { ContactSection } from "@/components/portfolio/contact-form"
import { Footer } from "@/components/portfolio/footer"

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createSupabaseServerClient()

  let projects = []
  let blogs = []
  let aboutData = null
  let socialLinks = []

  try {
    const results = await Promise.all([
      supabase.from('projects').select('*').eq('published', true).order('display_order'),
      supabase.from('blogs').select('*').eq('published', true).order('published_at', { ascending: false }),
      supabase.from('about').select('*').maybeSingle(),
      supabase.from('social_links').select('*').order('display_order', { ascending: true }),
    ])

    projects = results[0].data ?? []
    blogs = results[1].data ?? []
    aboutData = results[2].data
    socialLinks = results[3].data ?? []

  } catch (error) {
    console.error('HomePage data fetch error:', error)
  }

  const safeProjects = projects
  const safeBlogs = blogs
  const safeSocial = socialLinks
  const resumeUrl = aboutData?.resume_url ?? null

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero links={safeSocial} />
      <About about={aboutData ?? { name: '', bio: '', image: '', resume_url: null }} />
      <TechStack />
      <Projects projects={safeProjects} />
      <Writing blogs={safeBlogs} />
      <ContactSection resumeUrl={resumeUrl} links={safeSocial} />
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Ankit Kuntal',
            url: 'https://your-domain.com',
            jobTitle: 'Full-Stack Developer',
            description: 'Full-stack developer creating web applications with Next.js, Supabase and React.',
            sameAs: safeSocial
              .map((link) => link.url)
              .filter((url) => typeof url === 'string' && url.trim().length > 0),
            knowsAbout: ['Next.js', 'React', 'Node.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
            hasProduct: safeProjects
              .filter((project) => project.title)
              .map((project) => ({
              '@type': 'Product',
              name: project.title,
              description: project.description,
              url: project.live_url || 'https://your-domain.com',
              image: project.image_url || 'https://your-domain.com/default-project-image.jpg',
            })),
          }),
        }}
      />
    </main>
  )
}