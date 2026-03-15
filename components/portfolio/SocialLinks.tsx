"use client"

import { useState } from "react"
import { Github, Linkedin, Twitter , Instagram , Youtube} from "lucide-react"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  instagram: Instagram,
  youtube: Youtube,
}

const platformBg: Record<string, string> = {
  github: "bg-gray-800 dark:bg-gray-200",
  linkedin: "bg-blue-600 dark:bg-blue-400",
  x: "bg-black dark:bg-gray-300",
  youtube: "bg-red-600 dark:bg-red-400",
  instagram: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
}

type SocialLink = {
  platform: string
  url: string
}

const links: SocialLink[] = [
  { platform: "Youtube", url: "https://youtube.com/yourchannel" },
  { platform: "Github", url: "https://github.com/yourusername" },
  { platform: "Instagram", url: "https://instagram.com/yourusername" },
  { platform: "X", url: "https://x.com/yourusername" }, // X (formerly Twitter)
  { platform: "Linkedin", url: "https://linkedin.com/in/yourusername" },
]

export function SocialLinks({ className = "" }: { className?: string }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={`flex items-center ${className} pb-7`}>
      {links.map((link, index) => {
        const IconComponent = iconMap[link.platform.toLowerCase()] ?? Github
        const isHovered = hoveredIndex === index

        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.platform}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              relative flex items-center justify-center w-16 h-16 rounded-full border-2 border-white/20
              transition-transform duration-200
              ${isHovered ? "scale-110 -translate-y-2 z-50" : "z-auto"}
              ${platformBg[link.platform.toLowerCase()] ?? "bg-gray-500"}
              text-white
              ml-[-14px]
              first:ml-0
            `}
          >
            <IconComponent className="w-7 h-7" />
            {/* Tooltip */}
            <span
              className={`
                absolute bottom-[-28px] left-1/2 -translate-x-1/2
                bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded
                opacity-${isHovered ? 100 : 0} pointer-events-none transition-opacity
              `}
            >
              {link.platform}
            </span>
          </a>
        )
      })}
    </div>
  )
}