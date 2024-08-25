import Stripe from 'stripe'
import {
  handleProcessWebhookUpdatedSubscription, // Função personalizada para processar atualizações de assinatura
  stripe, // Instância do Stripe configurada
} from '@/services/stripe'

import { headers } from 'next/headers'

// este webhook é usado pelo stripe e é configurado pelo comando:
// stripe listen --forward-to localhost:3000/api/stripe/webhook
// apos 'stripe login'
export async function POST(req: Request) {

  // Lê o corpo da requisição como texto
  const body = await req.text()
  // Obtém a assinatura do Stripe presente nos cabeçalhos da requisição
  const signature = headers().get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    // Tenta construir o evento usando o corpo da requisição, a assinatura e a chave secreta do webhook do Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    )
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`)
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Verifica o tipo de evento recebido do Stripe
  // Neste caso, está lidando com criação e atualização de assinaturas
  switch (event.type) {
    case 'customer.subscription.created': // Evento de criação de assinatura
    case 'customer.subscription.updated': // Evento de atualização de assinatura

      // Chama a função para processar a atualização da assinatura com os dados do update atual (plano PRO)
      await handleProcessWebhookUpdatedSubscription(event.data)
      break
    default:
      // Para outros tipos de eventos que não estão sendo manipulados, apenas registra no console
      console.log(`Unhandled event type ${event.type}`)
  }

  // Retorna uma resposta de sucesso indicando que o evento foi recebido corretamente
  return new Response('{ "received": true }', { status: 200 })
}
