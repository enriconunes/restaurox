import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderNav,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { TodoDataTable } from './_components/todo-data-table'
import { TodoUpsertSheet } from './_components/todo-upsert-sheet'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import { getUserTodos } from './actions'
import RestaurantMainDetails from './_components/restaurant-main-datails'
import AddNewCategory from './_components/add-new-category'
import CategoriesWithItems from './_components/categories-with-items'
import QRCodeComponent from './_components/qr-code'

export default async function Page() {
  const todos = await getUserTodos()

  return (
    <DashboardPage>
      <DashboardPageHeader className=''>
        <DashboardPageHeaderTitle>Seu restaurante</DashboardPageHeaderTitle>
        <DashboardPageHeaderNav>
          <DashboardPageHeaderNav>
            <TodoUpsertSheet>
              <Button variant="outline" size="sm">
                <PlusIcon className="w-4 h-4 mr-3" />
                Add todo
              </Button>
            </TodoUpsertSheet>
          </DashboardPageHeaderNav>
        </DashboardPageHeaderNav>
      </DashboardPageHeader>
      <DashboardPageMain>
        {/* <TodoDataTable data={todos} /> */}
        <RestaurantMainDetails />
        <h3 className='mx-auto text-center text-lg font-medium mt-3'>Detalhes do seu cardápio</h3>
        <AddNewCategory />
        <CategoriesWithItems />
        <QRCodeComponent idUser='123' restaurantName='lenha na brasa'/>
      </DashboardPageMain>
    </DashboardPage>
  )
}