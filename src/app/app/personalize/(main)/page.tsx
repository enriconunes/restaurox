import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { auth } from '@/services/auth' // Importa o serviço de autenticação
import EditRestaurantInfo from '../_components/edit-main-restaurant-details'
import { getMainRestaurantDescriptionByIdUser } from './actions';
import { getPlanName } from '../../(main)/actions';

export default async function Page() {
  // const todos = await getUserTodos()

  const session = await auth() // Obtém a sessão de autenticação
  const { error, data } = await getMainRestaurantDescriptionByIdUser(session?.user.id as string);

  const planName = await getPlanName()

  return (
    <EditRestaurantInfo data={data!} planName={planName.data as string}/>
  )
}