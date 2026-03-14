"use client"

import { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { Mail, Github, Linkedin, Twitter, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from "@/app/actions/contact"
import { createClient } from '@/lib/supabase/client'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  instagram: () => <span className="text-xl">📸</span>,
  youtube: () => <span className="text-xl">▶️</span>,
}

type SocialLink = {
  platform: string
  url: string
  icon?: string | null
}

const initialState: ContactFormState = {}

export function ContactSection() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(true)

  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  useEffect(() => {
    const supabase = createClient()
    
    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('platform, url, icon')
          .order('display_order', { ascending: true })
          .limit(6)

        if (error) throw error
        setLinks(data || [])
      } catch (err) {
        console.error("Social links fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-blue-500 border-0 overflow-hidden">
            <CardContent className="p-8 sm:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Left - Info + Links */}
                <div className="space-y-6">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Let's build something great together.
                  </h2>

                  <div className="space-y-4">
                    <a
                      href="mailto:hello@dev.com"
                      className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>hello@dev.com</span>
                    </a>

                    <div className="flex gap-4 flex-wrap">
                      {loading ? (
                        <div className="text-white/70">Loading links...</div>
                      ) : links.length > 0 ? (
                        links.map((link) => {
                          const lowerPlatform = link.platform.toLowerCase()
                          const lowerIcon = link.icon?.toLowerCase()

                          const IconComponent = 
                            (lowerIcon && iconMap[lowerIcon]) ||
                            iconMap[lowerPlatform] ||
                            Github

                          return (
                            <a
                              key={link.platform}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                              aria-label={link.platform}
                            >
                              <IconComponent className="w-5 h-5" />
                            </a>
                          )
                        })
                      ) : (
                        <div className="text-white/70 text-sm">No social links added yet</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right - Contact Form */}
                {state.success ? (
                  <div className="bg-white/10 rounded-xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="text-white/80">Thanks for reaching out. I'll get back to you soon.</p>
                  </div>
                ) : (
                  <form action={formAction} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Name"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20"
                      />
                      {state.errors?.name && (
                        <p className="text-white/80 text-sm mt-1">{state.errors.name[0]}</p>
                      )}
                    </div>
                    {/* email and message fields same as your original */}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-white text-blue-500 hover:bg-white/90 rounded-full h-11 font-medium disabled:opacity-70"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                    {state.error && (
                      <p className="text-white/80 text-sm text-center">{state.error}</p>
                    )}
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}