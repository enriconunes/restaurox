// app/dashboard/page.tsx
import { auth } from '@/services/auth'
import { getUserRestaurantDetails } from './actions'
import CategoriesManager from './_components/cateogories-manager'
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import RestaurantMainDetails from './_components/restaurant-main-datails'

export default async function page() {
  const session = await auth()
  const { error, data } = await getUserRestaurantDetails(session?.user.id as string)

  return (
    <DashboardPage className='max-h-screen overflow-y-scroll'>
      <DashboardPageHeader className=''>
        <DashboardPageHeaderTitle>Seu restaurante</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <RestaurantMainDetails data={data}/>
        <h3 className='mx-auto text-center text-lg font-medium mt-3'>Detalhes do seu cardápio</h3>
        <CategoriesManager initialData={data} />
      </DashboardPageMain>
    </DashboardPage>
  )
}