// components/portfolio/SocialLinks.tsx
"use client"

import { useState } from "react"
import { Github, Linkedin, Twitter, Instagram, Youtube, Link as LinkIcon } from "lucide-react"

const platformConfig: Record<string, { icon: any, color: string, defaultUrl: string }> = {
  github: { icon: Github, color: "bg-gray-800", defaultUrl: "https://github.com" },
  linkedin: { icon: Linkedin, color: "bg-blue-600", defaultUrl: "https://linkedin.com" },
  x: { icon: Twitter, color: "bg-black", defaultUrl: "https://x.com" },
  instagram: { icon: Instagram, color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600", defaultUrl: "https://instagram.com" },
  youtube: { icon: Youtube, color: "bg-red-600", defaultUrl: "https://youtube.com" },
}

export function SocialLinks({ links = [] }: { links?: any[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Platforms jo humein har haal mein dikhane hain
  const platformsToShow = ["github", "linkedin", "instagram", "x", "youtube"];

  return (
    <div className="flex items-center pb-7">
      {platformsToShow.map((pName, index) => {
        // Check karo ki kya backend (Supabase) se is platform ka koi link aaya hai?
        const dbLink = links.find(l => l.platform?.toLowerCase().trim() === pName);
        const config = platformConfig[pName];
        
        // Final URL: Agar DB mein hai toh wo use karo, nahi toh default wala
        const finalUrl = dbLink?.url || config.defaultUrl;
        
        const Icon = config.icon;
        const isHovered = hoveredIndex === index;

        return (
          <a
            key={pName}
            href={finalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              relative flex items-center justify-center w-14 h-14 rounded-full border-2 border-white/20
              transition-all duration-200 ml-[-12px] first:ml-0 text-white
              ${isHovered ? "scale-110 -translate-y-2 z-50 shadow-xl" : "z-auto"}
              ${config.color}
            `}
          >
            <Icon className="w-6 h-6" />
            <span className={`absolute bottom-[-30px] bg-black/80 text-[10px] px-2 py-1 rounded transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
              {pName.toUpperCase()}
            </span>
          </a>
        )
      })}
    </div>
  )
}