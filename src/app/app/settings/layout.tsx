import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageHeaderTitle,
  DashboardPageMain,
} from '@/components/dashboard/page'
import { PropsWithChildren } from 'react'
import { SettingsSidebar } from './_components/settings-sidebar'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DashboardPage>
      <DashboardPageHeader>
        <DashboardPageHeaderTitle>Configurações</DashboardPageHeaderTitle>
      </DashboardPageHeader>
      <DashboardPageMain>
        <div className="max-w-screen-lg">
          <div className="flex flex-col lg:grid lg:grid-cols-[10rem_1fr] lg:gap-12">
            <SettingsSidebar />
            <div className="mt-6 lg:mt-0">{children}</div>
          </div>
        </div>
      </DashboardPageMain>
    </DashboardPage>
  )
}