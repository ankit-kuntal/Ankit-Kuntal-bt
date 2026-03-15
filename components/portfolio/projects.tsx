"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Project {
  title: string
  description: string
  image: string
  live_url?: string
  github_url?: string
  tags?: string[] | string
}

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  const project = projects[currentIndex]

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-foreground"
        >
          Selected Projects
        </motion.h2>
      </div>

      <div className="relative max-w-md mx-auto">
        {/* Project Card */}
        <motion.div
          key={project.title}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="group bg-card border-border overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {(Array.isArray(project.tags) ? project.tags : []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2 justify-center">
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live
                    </Button>
                  </a>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="rounded-full">
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </Button>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Carousel Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-0 -translate-y-1/2 bg-card p-2 rounded-full shadow hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-0 -translate-y-1/2 bg-card p-2 rounded-full shadow hover:bg-gray-200 transition"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}