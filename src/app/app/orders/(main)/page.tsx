import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'

import OrdersListing from '../_components/orders-listing'
import { auth } from '@/services/auth' // Importa o serviço de autenticação

export default async function Page() {

  const session = await auth() // Obtém a sessão de autenticação

  return (
    <DashboardPage className='max-h-screen overflow-y-scroll'>
      <DashboardPageHeader className=''>
        <DashboardPageHeaderTitle>Pedidos</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <OrdersListing userId={session?.user.id}/>
      </DashboardPageMain>
    </DashboardPage>
  )
}