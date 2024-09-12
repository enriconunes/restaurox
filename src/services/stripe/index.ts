import Stripe from 'stripe'

import { config } from '@/config'
import { prisma } from '../database'


export const stripe = new Stripe(config.stripe.secretKey || '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

export const getStripeCustomerByEmail = async (email: string) => {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]
}

// criar novo usuario nos registros do stripe ao fazer login
export const createStripeCustomer = async (input: {
  name?: string
  email: string
}) => {
  const customer = await getStripeCustomerByEmail(input.email)

  // se ja existir, retorna o cliente
  if (customer) return customer

  // se nao existir, regtistra ele nos registros do stripe
  const createdCustomer = await stripe.customers.create({
    email: input.email,
    name: input.name,
  })

  // atribui a ele um plano, iniciando em FREE (o plano vem da config)
  const createdCustomerSubscription = await stripe.subscriptions.create({
    customer: createdCustomer.id,
    items: [{ price: config.stripe.plans.free.priceId }],
  })

  // apos os registros do stripe, atualizar base de dados com essas informacoes
  // identifica o User do sistema pelo email e insere os dados abaixo
  await prisma.user.update({
    where: {
      email: input.email,
    },
    data: {
      stripeCustomerId: createdCustomer.id, //id do cliente do stripe
      stripeSubscriptionId: createdCustomerSubscription.id, //id da assinatura
      stripeSubscriptionStatus: createdCustomerSubscription.status, //id do status da assinatura
      stripePriceId: config.stripe.plans.free.priceId, //id do preco da assinatura
    },
  })

  return createdCustomer
}

// uma session é um processo aberto para fazer um pagamento
// o cliente acessa a funcao do sistema de fazer um pagamento,
// o sistema redireciona para o stripe para abrir uma nova session (checkout)
// com o checkout finalizado o stripe redireciona de volta para a pagina do sistema
export const createCheckoutSession = async (
  userId: string,
  userEmail: string,
  userStripeSubscriptionId: string,
) => {
  try {
    // ao abrir uma nova session, é chamada a funcao abaixo
    // a funcao cria um novo registro do user no stripe
    // caso o registro ja exista, ele retorna este user
    const customer = await createStripeCustomer({
      email: userEmail,
    })

    // recuperar assinatura atual
    const subscription = await stripe.subscriptionItems.list({
      subscription: userStripeSubscriptionId,
      limit: 1,
    })

    // criar uma nova session para atualizar o plano existente nos registros do stripe
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: 'http://localhost:3000/app/settings/billing',
      flow_data: {
        type: 'subscription_update_confirm', //atualizacao de inscricao
        after_completion: {
          type: 'redirect',
          redirect: {
            return_url:
              'http://localhost:3000/app/settings/billing?success=true', //ao completar o checkout, redirecionar
          },
        },
        // ao confirmar....
        subscription_update_confirm: {
          subscription: userStripeSubscriptionId, //inscricao atual
          items: [ 
            {
              id: subscription.data[0].id, //plano atual
              price: config.stripe.plans.pro.priceId, //id do preço da nova assinatura
              quantity: 1,
            },
          ],
        },
      },
    })

    // retona a url que o user deve entrar para finalizar o checkout no stripe
    return {
      url: session.url,
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error to create checkout session')
  }
}

// funcao chamada no webhook (api) do stripe para processar updates das assinaturas
export const handleProcessWebhookUpdatedSubscription = async (event: {
  object: Stripe.Subscription //recebe um evento que contém um objeto de assinatura do Stripe
}) => {
  // recuperar informacoes desse objeto:
  const stripeCustomerId = event.object.customer as string //o id do cliente no stripe
  const stripeSubscriptionId = event.object.id as string //o id da assinatura no stripe
  const stripeSubscriptionStatus = event.object.status //o status da assinatura (active, canceled...)
  const stripePriceId = event.object.items.data[0].price.id //o preco da nova assinatura

  // verificar se o user existe pelo subscriptionId ou pelo CostumerId
  // o sistema trabalha com duas 'base de dados': a interna do sistema e a do stripe
  // o trecho abaixo verifica se existe, na db do sistema, o user correspondente do stripe
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [
        {
          stripeSubscriptionId,
        },
        {
          stripeCustomerId,
        },
      ],
    },
    select: {
      id: true,
    },
  })

  // o user registrado no stripe nao corresponde a nenhum user na nossa db do sistema
  if (!userExists) {
    throw new Error('user of stripeCustomerId not found')
  }

  console.log("DADOS RECENTES flag 1: ", stripeCustomerId, stripeSubscriptionId, stripeSubscriptionStatus, stripePriceId)

  // se existir, atualiza os dados do user na db com a assinatura mais recente (a nova)
  await prisma.user.update({
    where: {
      id: userExists.id,
    },
    data: {
      stripeCustomerId,
      stripeSubscriptionId,
      stripeSubscriptionStatus,
      stripePriceId,
    },
  })
}

// tipagem dos planos definidos na config
type Plan = {
  priceId: string
  quota: {
    TASKS: number
  }
}

type Plans = {
  [key: string]: Plan
}

// obter nome e beneficios do plano atual com base no id do preço
export const getPlanByPrice = (priceId: string) => {

  // recupera todos os planos da config e faz a tipagem
  const plans: Plans = config.stripe.plans

  // recupera apenas o planKey dos planos
  const planKey = Object.keys(plans).find(
    (key) => plans[key].priceId === priceId,
  ) as keyof Plans | undefined

  // pegar todo o objeto do plano
  const plan = planKey ? plans[planKey] : null

  // nenhum plano encontrado pelo id do preço
  if (!plan) {
    throw new Error(`Plan not found for priceId: ${priceId}`)
  }

  // retorna o nome e o beneficio do plano
  return {
    name: planKey,
    quota: plan.quota,
  }
}

export const getUserCurrentPlan = async (userId: string) => {

  // identificar se o user existe
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripePriceId: true,
    },
  })

  if (!user || !user.stripePriceId) {
    throw new Error('User or user stripePriceId not found')
  }

  // identificar o plano atual a partir do stripePriceId do user logado
  const plan = getPlanByPrice(user.stripePriceId)

  console.log(plan)

  // contar quantos itens o user logado tem na db
  const itemsCount = await prisma.item.count({
  where: {
    category: {
      restaurant: {
        userId: userId,
      },
    },
  },
});
  // identificar quantas tasks tem disponiveis no plano a partir do arq de configuracao
  const availableTasks = plan.quota.TASKS //maximo de itens disponibilizados pelo plano
  const currentItems = itemsCount
  const usage = (currentItems / availableTasks) * 100 //calcular percentual usado

  // retornar todas essas informacoes
  return {
    name: plan.name,
    quota: {
      TASKS: {
        available: availableTasks,
        current: currentItems,
        usage,
      },
    },
  }
}

