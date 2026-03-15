import { createSupabaseServerClient } from '@/lib/supabase/server';

import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { About } from "@/components/portfolio/about";
import { TechStack } from "@/components/portfolio/tech-stack";
import { Projects, type Project } from "@/components/portfolio/projects";
import { Writing, type BlogPost } from "@/components/portfolio/writing";
import { ContactSection } from "@/components/portfolio/contact-form";
import { Footer } from "@/components/portfolio/footer";

// 1. CACHE KILLER: Iske bina Admin mein update karne par frontend change nahi hoga
export const revalidate = 0; 

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  // Fetch data in parallel
  const [
    { data: projects },
    { data: blogs },
    { data: about },
    { data: socialLinks }, // Yeh variable fetch kar rahe hain
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('published', true).order('display_order'),
    supabase.from('blogs').select('*').eq('published', true).order('date', { ascending: false }),
    supabase.from('about').select('*').maybeSingle(),
    
    // FIX 1: .maybeSingle() HATA DIYA. Humein pura array chahiye (github, insta, etc.)
    supabase.from('social_links').select('*').order('display_order', { ascending: true }),
  ]);

  // Fallback to empty arrays
  const safeProjects = projects || [];
  const safeBlogs = blogs || [];
  const safeSocial = socialLinks || []; // Yeh ab ek array hai [{}, {}]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* FIX 2: Hero ko links pass karna bhool gaye the */}
      <Hero links={safeSocial} />

      <About about={about || {}} />
      
      <TechStack />
      
      <Projects projects={safeProjects} />
      
      <Writing blogs={safeBlogs} />

      {/* FIX 3: ContactSection ko 'links' prop bhejiye (Prop name matching) */}
      <ContactSection links={safeSocial} /> 

      <Footer />
    </main>
  );
}