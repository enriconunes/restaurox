import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createCheckoutSessionAction } from './actions'
import { auth } from '@/services/auth'
import { getUserCurrentPlan } from '@/services/stripe'
import { CheckCircle } from 'lucide-react'

export default async function Component() {
  const session = await auth()
  const plan = await getUserCurrentPlan(session?.user.id as string)

  const proBenefits = [
    "Até 100 itens no cardápio",
    "Personalização das cores do cardápio",
    "Adicionar desconto aos seus itens",
    "URL do cardápio personalizada"
  ]

  return (
    <form action={createCheckoutSessionAction}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-xl sm:text-2xl">
            Seu Plano Atual: <span className="font-bold uppercase">{plan.name}</span>
          </CardTitle>
          <CardDescription className="text-sm">
            Compare os benefícios e escolha o melhor para o seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <span className='text-sm font-medium'>Uso dos recursos disponíveis:</span>
            <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
              <span>{plan.quota.TASKS.current}/{plan.quota.TASKS.available} itens</span>
              <span>{plan.quota.TASKS.usage.toFixed(2)}% utilizados</span>
            </div>
            <Progress value={plan.quota.TASKS.usage} className="h-2" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Plano FREE vs Plano PRO</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Plano FREE</h4>
                <ul className="space-y-1">
                  <li className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>Até 30 itens no cardápio</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">Plano PRO</h4>
                <ul className="space-y-1">
                  {proBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t border-border pt-6 space-y-4 sm:space-y-0">
          <span className="text-sm text-muted-foreground text-center sm:text-left">
            {plan.name === "free" 
              ? "Desbloqueie todos os recursos PRO agora!" 
              : "Você já está aproveitando todos os benefícios PRO!"}
          </span>
          <Button 
            type="submit" 
            disabled={plan.name === "pro"}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            {plan.name === "pro" ? 'Plano Atual: PRO' : 'Upgrade para PRO'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}