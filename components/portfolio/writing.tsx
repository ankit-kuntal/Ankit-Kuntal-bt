"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export interface BlogPost {
  slug: string          // make required now that we use it
  title: string
  date: string          // we'll format it nicely before passing
  excerpt?: string      // optional – can show teaser if you want later
}

interface WritingProps {
  blogs: BlogPost[]
  emptyMessage?: string // optional custom message
}

export function Writing({ blogs, emptyMessage = "No posts yet. Check back soon!" }: WritingProps) {
  if (blogs.length === 0) {
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

          <p className="text-center text-muted-foreground text-lg">{emptyMessage}</p>
        </div>
      </section>
    )
  }

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
          <p className="mt-3 text-muted-foreground">Thoughts, tutorials, and experiments</p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-2">
          {blogs.map((post, index) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group flex items-center justify-between p-5 rounded-xl hover:bg-card/80 border border-transparent hover:border-border transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <span className="text-sm text-muted-foreground font-medium w-28 flex-shrink-0 tabular-nums">
                  {post.date}
                </span>
                <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}