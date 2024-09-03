export const config = {
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    plans: {
      free: {
        priceId: 'price_1Pr7gbC7Vhx572wKVywwkmDD',
        quota: {
          TASKS: 30,
        },
      },
      pro: {
        priceId: 'price_1Pr7h1C7Vhx572wKPFaDec5Z',
        quota: {
          TASKS: 100,
        },
      },
    },
  },
}