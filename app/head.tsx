// app/head.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function Head() {
  // Supabase se social links aur projects fetch kar sakte ho (optional)
  const supabase = createSupabaseServerClient()
  let safeSocial: { url: string }[] = []
  let safeProjects: { title: string; description: string; live_url?: string; image_url?: string }[] = []

  try {
    const [socialRes, projectsRes] = await Promise.all([
      (await supabase).from('social_links').select('*').order('display_order', { ascending: true }),
      (await supabase).from('projects').select('*').eq('published', true).order('display_order')
    ])
    safeSocial = socialRes.data ?? []
    safeProjects = projectsRes.data ?? []
  } catch (err) {
    console.error('Head fetch error:', err)
  }

  return (
    <>
      {/* Google Search Console verification */}
      <meta name="google-site-verification" content="google11818d60c71f8f69" />

      {/* Global metadata */}
      <title>Dev - Full-Stack Developer Portfolio</title>
      <meta name="description" content="Discover Dev’s software products, projects, blog and contact info." />
      <meta name="keywords" content="Dev, full-stack developer, portfolio, web developer, React, Next.js, Supabase" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph / Social Preview */}
      <meta property="og:title" content="Dev - Full-Stack Developer Portfolio" />
      <meta property="og:description" content="Discover Dev’s software products, projects, blog and contact info." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://ankit-kuntal-bt.vercel.app" />
      <meta property="og:site_name" content="Dev Portfolio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Dev - Full-Stack Developer Portfolio" />
      <meta name="twitter:description" content="Discover Dev’s software products, projects, blog and contact info." />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Ankit Kuntal',
            url: 'https://ankit-kuntal-bt.vercel.app',
            jobTitle: 'Full-Stack Developer',
            description: 'Full-stack developer creating web applications with Next.js, Supabase and React.',
            sameAs: safeSocial.map((link) => link.url).filter((url) => !!url),
            knowsAbout: ['Next.js', 'React', 'Node.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
            hasProduct: safeProjects.map((project) => ({
              '@type': 'Product',
              name: project.title,
              description: project.description,
              url: project.live_url || 'https://ankit-kuntal-bt.vercel.app',
              image: project.image_url || 'https://ankit-kuntal-bt.vercel.app/default-project-image.jpg',
            })),
          }),
        }}
      />
    </>
  )
}