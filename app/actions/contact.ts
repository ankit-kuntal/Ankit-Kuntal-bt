"use server"

import { z } from "zod"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export type ContactFormState = {
  success?: boolean
  error?: string
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
  }
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }

  const validatedFields = contactSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Here you can integrate with Supabase or Resend
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'Portfolio <contact@yourdomain.com>',
  //   to: ['your@email.com'],
  //   subject: `New message from ${validatedFields.data.name}`,
  //   text: `
  //     Name: ${validatedFields.data.name}
  //     Email: ${validatedFields.data.email}
  //     Message: ${validatedFields.data.message}
  //   `,
  // })

  // For now, just simulate success
  console.log("Contact form submitted:", validatedFields.data)

  return {
    success: true,
  }
}
