// app/page.tsx – Fixed & Improved Version

import { createSupabaseServerClient } from '@/lib/supabase/server'

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
      supabase.from('blogs').select('*').eq('published', true).order('date', { ascending: false }),
      supabase.from('about').select('*').maybeSingle(),
      supabase.from('social_links').select('*').order('display_order', { ascending: true }),
    ])

    projects = results[0].data ?? []
    blogs = results[1].data ?? []
    aboutData = results[2].data
    socialLinks = results[3].data ?? []

  } catch (error) {
    console.error('HomePage data fetch error:', error)
    // Optional: error boundary ya fallback UI dikha sakte ho
  }

  const safeProjects = projects
  const safeBlogs = blogs
  const safeSocial = socialLinks

  // Resume URL explicitly nikaal rahe hain
  const resumeUrl = aboutData?.resume_url ?? null

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero links={safeSocial} />
      
      {/* About ko safe fallback de rahe hain */}
      <About about={aboutData ?? { name: '', bio: '', image: '', resume_url: null }} />
      
      <TechStack />
      <Projects projects={safeProjects} />
      <Writing blogs={safeBlogs} />
      
      {/* Yahan resumeUrl pass kar diya – button ab dikhna chahiye agar DB mein value hai */}
      <ContactSection 
        resumeUrl={resumeUrl}
        links={safeSocial} 
      />
      
      <Footer />
    </main>
  )
}