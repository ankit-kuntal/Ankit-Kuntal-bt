"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const technologies = [
  { name: "React", icon: "⚛️", url: "https://react.dev/" },
  { name: "Next.js", icon: "▲", url: "https://nextjs.org/" },
  { name: "Tailwind", icon: "🎨", url: "https://tailwindcss.com/" },
  { name: "TypeScript", icon: "TS", url: "https://www.typescriptlang.org/" },
  { name: "Node.js", icon: "🟢", url: "https://nodejs.org/" },
  { name: "PostgreSQL", icon: "🐘", url: "https://www.postgresql.org/" },
  { name: "MongoDB", icon: "🍃", url: "https://www.mongodb.com/" },
  { name: "JavaScript", icon: "JS", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "Vercel", icon: "▲", url: "https://vercel.com/" },
  { name: "AWS", icon: "☁️", url: "https://aws.amazon.com/" },
  { name: "v0.dev", icon: "🤖", url: "https://v0.dev/" },    // Official link added
  { name: "Lovable", icon: "💖", url: "https://lovable.ai/" }, // Official link added
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function TechStack() {
  return (
    <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            My Tech Stack
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {technologies.map((tech) => (
            <motion.div key={tech.name} variants={item}>
              <a href={tech.url} target="_blank" rel="noopener noreferrer">
                <Card className="bg-card border-border hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">{tech.icon}</span>
                    <span className="text-sm font-medium text-foreground">{tech.name}</span>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}