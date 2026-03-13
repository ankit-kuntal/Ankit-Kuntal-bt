import { Navbar } from "@/components/portfolio/navbar"
import { Hero } from "@/components/portfolio/hero"
import { About } from "@/components/portfolio/about"
import { TechStack } from "@/components/portfolio/tech-stack"
import { Projects, type Project } from "@/components/portfolio/projects"
import { Writing, type BlogPost } from "@/components/portfolio/writing"
import { ContactSection } from "@/components/portfolio/contact-form"
import { Footer } from "@/components/portfolio/footer"

// Sample data - replace with Supabase data fetching
const sampleProjects: Project[] = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management, payment processing, and an intuitive admin dashboard.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
  },
  {
    title: "AI Content Generator",
    description: "An AI-powered platform that generates high-quality marketing copy, blog posts, and social media content using advanced language models.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop",
    live_url: "https://example.com",
    github_url: "https://github.com",
    tags: ["React", "OpenAI", "Node.js", "Redis"],
  },
]

const sampleBlogs: BlogPost[] = [
  { date: "Mar 2026", title: "Building Scalable APIs with Next.js Server Actions" },
  { date: "Feb 2026", title: "The Art of Minimalist UI Design" },
  { date: "Jan 2026", title: "Why TypeScript is Essential for Modern Web Development" },
  { date: "Dec 2025", title: "Optimizing React Performance: A Deep Dive" },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <TechStack />
      <Projects projects={sampleProjects} />
      <Writing blogs={sampleBlogs} />
      <ContactSection />
      <Footer />
    </main>
  )
}
