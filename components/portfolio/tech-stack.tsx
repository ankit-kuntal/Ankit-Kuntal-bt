"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const technologies = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "Tailwind", icon: "🎨" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "🟢" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "Docker", icon: "🐳" },
  { name: "Redis", icon: "🔴" },
  { name: "GraphQL", icon: "◈" },
  { name: "OAuth", icon: "🔐" },
  { name: "Vercel", icon: "▲" },
  { name: "AWS", icon: "☁️" },
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">My Tech Stack</h2>
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
              <Card className="bg-card border-border hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 cursor-default">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">{tech.icon}</span>
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
