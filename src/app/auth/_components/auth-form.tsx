'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import Logo from "@/components/logo"

export default function AuthForm() {
    const [showSpamMessage, setShowSpamMessage] = useState(false)
    const user = process.env.NEXTAUTH_URL

    const form = useForm()

    const handleSubmit = form.handleSubmit(async (data) => {
        try {
            await signIn('nodemailer', { email: data.email, redirect: false, callbackUrl: '/app' })
            toast({
                title: 'Link de confirmação enviado!',
                description: `Verifique o seu e-mail para validar o seu login.`
            })
            setShowSpamMessage(true)
        } catch(error) {
            toast({
                title: 'Erro ao enviar mensagem para o seu email.',
                description: 'Identificamos um erro ao enviar uma link de confirmação por email. Tente novamente ou entre em contato com o nosso suporte.'
            })
        }
    })

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 bg-stone-50">
            <div className="w-full max-w-md space-y-8 border p-8 rounded-md shadow-md bg-white">
                <div className="w-48 mx-auto opacity-75">
                    <Logo />
                </div>

                <div>
                    <h2 className="lg:mt-6 text-gray-700 text-center text-xl lg:text-3xl font-bold tracking-tight text-foreground">
                        Entre com o seu email
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Digite o seu e-mail e te enviaremos um link de acesso.
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Endereço de email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Endereço de email"
                            className="block w-full appearance-none rounded-md border border-input bg-background px-3 py-2 placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            {...form.register('email')}
                        />
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? 'Enviando...' : 'Enviar link'}
                        </Button>
                    </div>
                </form>
                {showSpamMessage && (
                    <div className="p-3 bg-gray-50 border text-sm border-gray-200 text-gray-500 rounded">
                        <p className="text-sm">
                            Caso não encontre o email na caixa de entrada, verifique o lixo eletrônico ou a pasta de spam.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}