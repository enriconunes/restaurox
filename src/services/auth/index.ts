import NextAuth from "next-auth"
import EmailProvider from "next-auth/providers/nodemailer"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../database"
import { createStripeCustomer } from "../stripe"
import { setupNewClientModels } from "@/app/auth/actions"
import { createTransport } from "nodemailer"

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
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider: { server, from },
      }) => {
        const { host } = new URL(url)
        const transport = createTransport(server)
        try {
          const result = await transport.sendMail({
            to: email,
            from,
            subject: `Acesse seu Cardápio Digital no Restaurox`,
            text: text({ url, host }),
            html: html({ url, host, email }),
          })
          const failed = result.rejected.concat(result.pending).filter(Boolean)
          if (failed.length) {
            throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
          }
        } catch (error) {
          console.error('Erro ao enviar email de verificação', error)
          throw new Error('SEND_VERIFICATION_EMAIL_ERROR')
        }
      },
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

function html({ url, host, email }: { url: string; host: string; email: string }) {
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const backgroundColor = "#f4f4f4"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#b91c1c"
  const buttonBorderColor = "#b91c1c"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <img src="https://utfs.io/f/0814f9dd-ba26-4a9e-b900-52f7fc5a336f-51kl5c.png" alt="Restaurox Logo" style="max-width: 200px; margin-bottom: 20px;">
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Olá, <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 15px 25px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Acessar Meu Cardápio Digital</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Clique no botão acima para acessar o Restaurox e começar a criar seu cardápio digital!
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 14px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Se você não solicitou este email, pode ignorá-lo com segurança.
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 14px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        © 2023 Restaurox - Seu Parceiro em Cardápios Digitais
      </td>
    </tr>
  </table>
</body>
`
}

function text({ url, host }: { url: string; host: string }) {
  return `
Olá!

Bem-vindo ao Restaurox - Seu Parceiro em Cardápios Digitais

Para acessar sua conta e começar a criar seu cardápio digital, clique no link abaixo:

${url}

Se você não solicitou este email, pode ignorá-lo com segurança.

© 2023 Restaurox - Todos os direitos reservados
`
}