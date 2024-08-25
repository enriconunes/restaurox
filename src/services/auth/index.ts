import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/nodemailer"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../database"
import { createStripeCustomer } from "../stripe"
 
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
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM
    })
  ],
  events: {
    // ao criar novo user, chama a funcao createStripeCustomer
    // essa funcao recebe o nome e email do user que acabou de se registrar
    // e cria um novo registro dele nos registros do stripe com plano free associado
    createUser: async (message) => {
      await createStripeCustomer({
        name: message.user.name as string,
        email: message.user.email as string,
      })
    }
  }
})