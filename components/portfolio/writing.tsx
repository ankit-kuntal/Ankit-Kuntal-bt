"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export interface BlogPost {
  date: string
  title: string
  slug?: string
}

interface WritingProps {
  blogs: BlogPost[]
}

export function Writing({ blogs }: WritingProps) {
  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Writing</h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-1">
          {blogs.map((post, index) => (
            <motion.a
              key={post.title}
              href={post.slug ? `/blog/${post.slug}` : "#"}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex items-center justify-between p-4 rounded-lg hover:bg-card transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-24 flex-shrink-0">{post.date}</span>
                <span className="text-foreground font-medium group-hover:text-blue-500 transition-colors">
                  {post.title}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
