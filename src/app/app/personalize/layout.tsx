import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { PropsWithChildren } from 'react'
import { PersonalizeSidebar } from './_components/personalize-side-bar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>Personalizações</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <div className="max-w-screen-lg">
          <div className="lg:grid lg:grid-cols-[10rem_1fr] lg:gap-12">
            <PersonalizeSidebar />
            <div>{children}</div>
          </div>
        </div>
      </DashboardPageMain>
    </DashboardPage>
  )
}