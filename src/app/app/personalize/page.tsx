import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { auth } from '@/services/auth' // Importa o serviço de autenticação
import EditRestaurantInfo from './_components/edit-main-restaurant-details'
import EditOperatingHours from './_components/edit-operating-hours'
import TailwindColorSelectorForm from './_components/tailwind-color-mosaic'

export default async function Page() {
  // const todos = await getUserTodos()

  const session = await auth() // Obtém a sessão de autenticação


  return (
    <DashboardPage>
      <DashboardPageHeader className=''>
        <DashboardPageHeaderTitle>Personalize o seu restaurante</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <EditRestaurantInfo />
        <EditOperatingHours />
        <TailwindColorSelectorForm />
      </DashboardPageMain>
    </DashboardPage>
  )
}