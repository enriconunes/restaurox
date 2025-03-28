import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/nodemailer"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../database"
import { createStripeCustomer } from "../stripe"
import { setupNewClientModels } from "@/app/auth/actions"
import { createTransport } from "nodemailer"
import { sendVerificationRequest } from "@/lib/resend"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth',
    signOut: '/auth',
    error: '/auth',
    verifyRequest: '/auth',
    newUser: '/app'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER_HOST,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest
    }),
  ],
  events: {
    // ao criar novo user, chama a funcao createStripeCustomer
    // essa funcao recebe o nome e email do user que acabou de se registrar
    // e cria um novo registro dele nos registros do stripe com plano free associado
    createUser: async (message) => {
      // funcao para criar um novo restaurante associado ao novo user
      await setupNewClientModels(message.user.id as string)

      await createStripeCustomer({
        name: message.user.name as string,
        email: message.user.email as string,
      })
    }
  }
})

