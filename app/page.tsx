// app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';

import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { TechStack } from "@/components/portfolio/tech-stack";
import { Projects, type Project } from "@/components/portfolio/projects";
import { Writing, type BlogPost } from "@/components/portfolio/writing";
import { ContactSection } from "@/components/portfolio/contact-form";
import { Footer } from "@/components/portfolio/footer";

// Define types (match your Supabase tables)
type AboutData = {
  bio?: string;
  years_experience?: number;
  projects_shipped?: number;
  location?: string;
  what_i_do?: { point: string }[]; // jsonb array
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  // Fetch data in parallel (fastest)
  const [
    { data: projects, error: projectsError },
    { data: blogs, error: blogsError },
    { data: about, error: aboutError },
    { data: socialLinks, error: socialError },
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6), // recent ya featured projects

    supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false })
      .limit(4),

    supabase
      .from('about')
      .select('*')
      .maybeSingle(), // single row expected, .single() error deta agar 0/ >1 rows

    supabase
      .from('social_links')
      .select('*')
      .maybeSingle(),
  ]);

  // Optional: error logging (production mein Sentry ya console.error kar sakte ho)
  if (projectsError || blogsError || aboutError || socialError) {
    console.error('Supabase fetch error:', { projectsError, blogsError, aboutError, socialError });
  }

  // Fallback to empty arrays/objects if no data or error
  const safeProjects = (projects || []) as Project[];
  const safeBlogs = (blogs || []) as BlogPost[];
  const safeAbout = (about || {}) as AboutData;
  const safeSocial = socialLinks || {};

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      {/* @ts-expect-error: About expects props, but IntrinsicAttributes type issue. */}
      <About about={safeAbout as AboutProps['about']} /> {/* Pass bio, stats, what_i_do etc. */}
      <TechStack /> {/* Agar static hai toh unchanged, warna alag fetch */}
      <Projects projects={safeProjects} />
      <Writing blogs={safeBlogs} />
      {/* @ts-expect-error: ContactSection expects props, but IntrinsicAttributes type issue. */}
      <ContactSection socialLinks={safeSocial as any} /> {/* email, github etc. */}
      <Footer />
    </main>
  );
}