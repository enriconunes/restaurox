import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'

import { getPlanName, getUserRestaurantDetails } from '../../(main)/actions'
import QRCodeComponent from '../_components/qr-code'
import { auth } from '@/services/auth' // Importa o serviço de autenticação

export default async function Page() {

  const session = await auth() // Obtém a sessão de autenticação

  const { error, data } = await getUserRestaurantDetails(session?.user.id as string);

  const planName = await getPlanName()

  return (
    <DashboardPage className='max-h-screen overflow-y-scroll'>
      <DashboardPageHeader className=''>
        <DashboardPageHeaderTitle>Compartilhamento</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <QRCodeComponent idRestaurant={data?.id!} restaurantName={data?.name!} planName={planName.data as string}/>
      </DashboardPageMain>
    </DashboardPage>
  )
}