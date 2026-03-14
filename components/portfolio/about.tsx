"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const capabilities = [
  "Building responsive, performant web applications",
  "Creating intuitive user interfaces with modern frameworks",
  "Developing scalable backend systems and APIs",
  "Implementing secure authentication and authorization",
]

export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Crafting experiences with code and design.
            </h2>

            <div className="flex flex-wrap gap-8">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold text-blue-500">5+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold text-blue-500">50+</p>
                <p className="text-sm text-muted-foreground">Projects Shipped</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">What I do</h3>
                <ul className="space-y-3">
                  {capabilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-500" />
                      </div>
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
