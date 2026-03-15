"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/portfolio/SocialLinks"

// 1. Types define karein taaki data correctly receive ho
interface HeroProps {
  links?: any[]; 
}

export function Hero({ links = [] }: HeroProps) { // 2. Links ko as a Prop liya
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                AVAILABLE FOR NEW PROJECTS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
            >
              Hi, I'm <span className="text-blue-500">Dev</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Full-stack developer passionate about crafting clean, premium, and high-performance digital experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex flex-wrap gap-4 w-full">
                <a href="#projects">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 h-11">
                    View Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="outline" className="rounded-full px-6 h-11 border-border">
                    Contact Me
                  </Button>
                </a>
              </div>

              {/* 3. SocialLinks ko yahan links pass kiye */}
              <div className="flex gap-4 mt-4">
                <SocialLinks links={links} />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Photo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-pink-400/30 animate-pulse blur-3xl"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-blue-500/30 dark:border-blue-300/30">
                <img
                  src="/a.jpg" 
                  alt="Dev"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}