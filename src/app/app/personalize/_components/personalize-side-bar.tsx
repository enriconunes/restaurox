'use client'

import {
  DashboardSidebarNav,
  DashboardSidebarNavLink,
  DashboardSidebarNavMain,
} from '@/components/dashboard/sidebar'
import { usePathname } from 'next/navigation'

export function PersonalizeSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside>
      <DashboardSidebarNav>
        <DashboardSidebarNavMain>
          <DashboardSidebarNavLink
            href="/app/personalize"
            active={isActive('/app/personalize')}
          >
            Dados do restaurante
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/app/personalize/time"
            active={isActive('/app/personalize/time')}
          >
            Definir horários
          </DashboardSidebarNavLink>
          <DashboardSidebarNavLink
            href="/app/personalize/theme"
            active={isActive('/app/personalize/theme')}
          >
            Tema do cardápio
          </DashboardSidebarNavLink>
        </DashboardSidebarNavMain>
      </DashboardSidebarNav>
    </aside>
  )
}
