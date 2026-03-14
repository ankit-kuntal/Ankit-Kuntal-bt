"use server"

import { z } from "zod"
import nodemailer from "nodemailer"

const contactSchema = z.object({
  name: z.string().min(2, "Naam kam se kam 2 letters ka hona chahiye"),
  email: z.string().email("Valid email address daalo"),
  message: z.string().min(10, "Message thoda detail mein likho (kam se kam 10 characters)"),
})

export type ContactFormResult = {
  success: boolean
  error?: string
  errors?: Record<string, string[]>
}

// Transporter create karo (env se secure)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

// Optional: Connection test karne ke liye (local mein run kar ke check kar sakte ho)
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error)
  } else {
    console.log("Transporter ready – Gmail SMTP connected!")
  }
})

export async function submitContactForm(formData: FormData): Promise<ContactFormResult> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  }

  const parsed = contactSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const info = await transporter.sendMail({
      from: `"Portfolio Contact (Local Test)" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // message aapke inbox mein
      replyTo: parsed.data.email,
      subject: `[LOCAL TEST] New Message from ${parsed.data.name}`,
      text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\nMessage:\n${parsed.data.message}`,
      html: `
        <h2>Local Test: New Contact Message</h2>
        <p><strong>Name:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${parsed.data.message}</p>
        <p>Reply directly if needed.</p>
      `,
    })

    console.log("Email sent locally! Message ID:", info.messageId)
    return { success: true }
  } catch (err: any) {
    console.error("Local email send error:", err)
    let errorMsg = "Message send nahi hua"
    if (err.code === "EAUTH") {
      errorMsg = "Gmail auth fail – App Password galat ya 2FA setup check karo (Error 535-5.7.8)"
    } else if (err.message?.includes("535")) {
      errorMsg = "Invalid login – App Password regenerate karo"
    }
    return {
      success: false,
      error: errorMsg,
    }
  }
}