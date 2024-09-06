import { PropsWithChildren } from "react";
import { MainSidebar } from "./_components/main-sidebar";
import { auth } from '@/services/auth'

// o layout será aplicado em todas as paginas dentro da pasta ./app
// todas as paginas terão o sidebar a esquerda e o conteudo na direita
// o conteudo será 'envelopado' pelo componente DashboardPage
// logo, todas as paginas serao compostas por apenas 2 componentes, o MainSidebar a esquerda e a DashboardPage a direita

// Adicionamos classes para tornar o layout responsivo
export default async function Layout({ children }: PropsWithChildren){
    const session = await auth()

    return(
        // Usamos flex para controlar o layout em diferentes tamanhos de tela
        <div className="flex flex-col lg:flex-row">
            {/* O sidebar agora é fixo na parte superior em telas menores e na lateral em telas maiores */}
            <div className="w-full lg:w-64 lg:flex-shrink-0">
                <MainSidebar user={session?.user!}/>
            </div>
            {/* O conteúdo principal agora ocupa toda a largura em telas menores */}
            <main className="flex-grow max-h-screen">
                {children}
            </main>
        </div>
    )
}