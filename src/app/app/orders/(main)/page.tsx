import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'

import OrdersListing from '../_components/orders-listing'
import { auth } from '@/services/auth' // Importa o serviço de autenticação
import { getPlanName } from '../../(main)/actions'

export default async function Page() {

  const session = await auth() // Obtém a sessão de autenticação
  const planName = await getPlanName()

  return (
    <DashboardPage className='max-h-screen overflow-y-scroll'>
      <DashboardPageHeader className=''>
        <DashboardPageHeaderTitle>Pedidos</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <OrdersListing userId={session?.user.id} planName={planName.data as string}/>
      </DashboardPageMain>
    </DashboardPage>
  )
}