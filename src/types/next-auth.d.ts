import { User } from '@prisma/client'

// sobrescrever tipagem do user do next-auth
// em vez de apenas nome, email, id...., agora terá todos os atributos
// do model User da base de dados
// esses atributos podem ser adicionados e lidos em qualquer pagina com a instancia do auth, ex:
// const session = await auth()
// session.user.stripeSubscriptionId as string

declare module 'next-auth' {
  interface Session {
    user: User
  }
}