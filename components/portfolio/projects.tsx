'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, ArrowLeft, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface Project {
  id: string // ID zaroori hai unique key ke liye
  title: string
  description: string
  image_url: string | null
  live_url?: string | null
  github_url?: string | null
  technologies?: string[]
}

interface ProjectsProps {
  projects: Project[]
}

export function Projects({ projects }: ProjectsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!projects || projects.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No projects found.</div>
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
  }

  const project = projects[currentIndex]

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Selected Projects
        </h2>
      </div>

      <div className="relative max-w-lg mx-auto">
        {/* AnimatePresence ensures the old slide leaves before the new one enters */}
        <AnimatePresence mode="wait">
          <motion.div
            // CRITICAL FIX: 'key' change hone par hi React image ko refresh karega
            key={project.id || project.title} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <article
              itemScope
              itemType="https://schema.org/SoftwareSourceCode"
              className="group"
            >
              <Card className="bg-card border-border overflow-hidden shadow-md">
                <meta itemProp="name" content={project.title} />
                <meta itemProp="description" content={project.description} />
                <meta itemProp="url" content={project.live_url || ''} />
                <div className="aspect-video relative overflow-hidden bg-muted">
                {project.image_url ? (
                  <img
                    // Key property yahan bhi add kar di hai double safety ke liye
                    key={project.image_url}
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>
              
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-[10px] bg-secondary rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  {project.live_url && (
                    <Button asChild size="sm" className="rounded-full">
                      <a href={project.live_url} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" /> Live
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <a href={project.github_url} target="_blank">
                        <Github className="w-4 h-4 mr-2" /> Code
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            </article>
            </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center text-sm font-medium">
            {currentIndex + 1} / {projects.length}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}