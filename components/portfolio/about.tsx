"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AboutProps {
  about?: {
    bio?: string;
    years_experience?: number;
    projects_shipped?: number;
    what_i_do?: any;
  } | null;
}

export function About({ about }: AboutProps) {
  const years = about?.years_experience ?? 0;
  const projects = about?.projects_shipped ?? 0;
  const bio = about?.bio || "Crafting experiences with code and design.";
  const capabilities = Array.isArray(about?.what_i_do) ? about.what_i_do : [];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8"> {/* Padding kam ki (20 -> 16) */}
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center"> {/* Gap kam kiya (12 -> 8) */}
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Font size 4xl se 2xl/3xl kiya taaki heavy na lage */}
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug">
              {bio}
            </h2>
            
            <div className="flex flex-wrap gap-6">
              <div className="space-y-0">
                <p className="text-2xl sm:text-3xl font-bold text-blue-500">{years}+</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Years Experience</p>
              </div>
              <div className="space-y-0">
                <p className="text-2xl sm:text-3xl font-bold text-blue-500">{projects}+</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Projects Shipped</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-5"> {/* Padding 6 se 5 ki */}
                <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-4">What I do</h3>
                <ul className="space-y-3">
                  {capabilities.length > 0 ? (
                    capabilities.map((item: any, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-blue-500" />
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed">
                          {item?.point || "Capability point"}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground text-xs italic">No capabilities added yet.</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}