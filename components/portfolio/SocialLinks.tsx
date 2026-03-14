"use client"

import { useEffect, useState } from "react"
import { Github, Linkedin, Twitter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  instagram: () => <span className="text-xl">📸</span>,
  youtube: () => <span className="text-xl">▶️</span>,
}

export type SocialLink = {
  platform: string
  url: string
  icon?: string | null
}

type Props = {
  className?: string
}

export function SocialLinks({ className = "" }: Props) {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from("social_links")
          .select("platform, url, icon")
          .order("display_order", { ascending: true })
          .limit(6)

        if (error) throw error
        setLinks(data || [])
      } catch (err) {
        console.error("Social links fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  if (loading) return <div className="text-white/70">Loading links...</div>
  if (links.length === 0)
    return <div className="text-white/70 text-sm">No social links added yet</div>

  return (
    <div className={`flex gap-4 flex-wrap ${className}`}>
      {links.map((link) => {
        const lowerPlatform = link.platform.toLowerCase()
        const lowerIcon = link.icon?.toLowerCase()
        const IconComponent =
          (lowerIcon && iconMap[lowerIcon]) || iconMap[lowerPlatform] || Github

        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label={link.platform}
          >
            <IconComponent className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}