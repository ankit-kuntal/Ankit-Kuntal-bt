"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                AVAILABLE FOR NEW PROJECTS
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
            >
              Hi, I'm <span className="text-blue-500">Dev</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              Full-stack developer building clean, premium, and high-performance digital experiences. Inspired by the minimalism of Vercel and Apple.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
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
            </motion.div>
          </motion.div>

          {/* Right Content - Avatar Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center overflow-hidden">
                {/* Avatar SVG */}
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Background circle */}
                  <circle cx="100" cy="100" r="95" className="fill-blue-100 dark:fill-blue-900/50" />
                  
                  {/* Hair */}
                  <path d="M50 85 Q50 40 100 35 Q150 40 150 85 Q150 95 145 100 L145 75 Q140 55 100 50 Q60 55 55 75 L55 100 Q50 95 50 85" className="fill-gray-800 dark:fill-gray-200" />
                  
                  {/* Face */}
                  <ellipse cx="100" cy="110" rx="45" ry="55" className="fill-amber-100 dark:fill-amber-200" />
                  
                  {/* Glasses frame */}
                  <rect x="60" y="95" width="30" height="25" rx="5" className="fill-none stroke-gray-700 dark:stroke-gray-300" strokeWidth="3" />
                  <rect x="110" y="95" width="30" height="25" rx="5" className="fill-none stroke-gray-700 dark:stroke-gray-300" strokeWidth="3" />
                  <line x1="90" y1="107" x2="110" y2="107" className="stroke-gray-700 dark:stroke-gray-300" strokeWidth="3" />
                  
                  {/* Eyes */}
                  <circle cx="75" cy="107" r="5" className="fill-gray-800 dark:fill-gray-200" />
                  <circle cx="125" cy="107" r="5" className="fill-gray-800 dark:fill-gray-200" />
                  
                  {/* Smile */}
                  <path d="M85 135 Q100 150 115 135" className="fill-none stroke-gray-700 dark:stroke-gray-300" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Shirt collar */}
                  <path d="M55 165 L100 180 L145 165 L145 200 L55 200 Z" className="fill-blue-500" />
                  <path d="M85 165 L100 180 L115 165" className="fill-none stroke-white" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
