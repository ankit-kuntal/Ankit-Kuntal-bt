// components/portfolio/contact-section.tsx
"use client"

import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { Mail, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { SocialLinks } from "@/components/portfolio/SocialLinks"
import { submitContactForm, type ContactFormResult } from "@/app/actions/contact"

// Props include resumeUrl
interface ContactSectionProps {
  links?: any[]
  resumeUrl?: string | null
}

export function ContactSection({ links = [], resumeUrl }: ContactSectionProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    const form = e.currentTarget
    const formData = new FormData(form)

    const result: ContactFormResult = await submitContactForm(formData)

    if (result.success) {
      setSuccess(true)
      if (typeof window !== "undefined" && document.contains(form)) {
        form.reset()
      }
    } else {
      if (result.errors) setFieldErrors(result.errors)
      else setError(result.error || "Something went wrong")
    }

    setLoading(false)
  }

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

                  <div className="flex gap-3 pt-2 flex-wrap">
                    {/* Resume Button */}
                    {resumeUrl && (
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-blue-500 px-4 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition"
                      >
                        View Resume
                      </a>
                    )}

                    {/* Certificates Button */}
                    <a
                      href="/certificates"
                      className="border border-white text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition"
                    >
                      Certificates
                    </a>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="mailto:ankitkuntal904@gmail.com"
                      className="flex items-center gap-3 text-white/90 hover:text-white transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>ankitkuntal904@gmail.com</span>
                    </a>

                    {/* Social Links */}
                    <SocialLinks links={links} />
                  </div>
                </div>

                {/* Right - Contact Form */}
                {success ? (
                  <div className="bg-white/10 rounded-xl p-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Message Sent!</h3>
                    <p className="text-white/80">Thanks for reaching out. I'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Name"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20"
                      />
                      {fieldErrors.name && <p className="text-white/80 text-sm mt-1">{fieldErrors.name[0]}</p>}
                    </div>

                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20"
                      />
                      {fieldErrors.email && <p className="text-white/80 text-sm mt-1">{fieldErrors.email[0]}</p>}
                    </div>

                    <div>
                      <Textarea
                        name="message"
                        placeholder="Message"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20 resize-none"
                        rows={5}
                      />
                      {fieldErrors.message && <p className="text-white/80 text-sm mt-1">{fieldErrors.message[0]}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-blue-500 hover:bg-white/90 rounded-full h-11 font-medium disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>

                    {error && <p className="text-white/80 text-center text-sm">{error}</p>}
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