import { PropsWithChildren } from "react";
import { MainSidebar } from "./_components/main-sidebar";
import { auth } from '@/services/auth'

// o layout será aplicado em todas as paginas dentro da pasta ./app
// todas as paginas terão o sidebar a esquerda e o conteudo na direita
// o conteudo será 'envelopado' pelo componente DashboardPage
// logo, todas as paginas serao compostas por apenas 2 componentes, o MainSidebar a esquerda e a DashboardPage a direita
export default async function Layout({ children }: PropsWithChildren){

    const session = await auth()

    return(
        <div className="grid grid-cols-[16rem_1fr]">
            <MainSidebar user={session?.user}/>
            <main>
                {children}
            </main>
        </div>
    )
}