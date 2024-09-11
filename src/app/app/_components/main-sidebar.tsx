'use client'

import { useState } from 'react'
import {
  DashboardSidebar,
  DashboardSidebarHeader,
  DashboardSidebarMain,
  DashboardSidebarNav,
  DashboardSidebarNavMain,
  DashboardSidebarNavLink,
  DashboardSidebarNavHeader,
  DashboardSidebarNavHeaderTitle,
  DashboardSidebarFooter,
} from '@/components/dashboard/sidebar'
import { usePathname } from 'next/navigation'
import { HomeIcon, GearIcon, Pencil2Icon, DashboardIcon, FileTextIcon, BarChartIcon } from '@radix-ui/react-icons'
import { UserDropdown } from './user-dropdown'
import Logo from '@/components/logo'
import { Session } from 'next-auth'

type MainSidebarProps = {
  user: Session['user']
}

export function MainSidebar({ user }: MainSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <DashboardSidebar className='min-h-screen' isOpen={isOpen} setIsOpen={setIsOpen}>
      {/* hidden esconde em tela menor, e flex exibe em telas >= lg */}
      <DashboardSidebarHeader className='hidden lg:flex'>
        <div className='w-3/5 mx-auto'>
          <Logo />
        </div>
      </DashboardSidebarHeader>
      <DashboardSidebarMain className="flex flex-col flex-grow">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink href="/app" active={isActive('/app')} onClick={handleLinkClick}>
              <HomeIcon className="w-3 h-3 mr-3" />
              Painel principal
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink href="/app/personalize" active={isActive('/app/personalize')} onClick={handleLinkClick}>
              <Pencil2Icon className="w-3 h-3 mr-3" />
              Personalizações
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/app/orders"
              active={isActive('/app/orders')}
              onClick={handleLinkClick}
            >
              <FileTextIcon className="w-3 h-3 mr-3" />
              Pedidos
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/app/metrics"
              active={isActive('/app/metrics')}
              onClick={handleLinkClick}
            >
              <BarChartIcon className="w-3 h-3 mr-3" />
              Métricas
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/app/qrcode"
              active={isActive('/app/qrcode')}
              onClick={handleLinkClick}
            >
              <DashboardIcon className="w-3 h-3 mr-3" />
              QR Code
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink
              href="/app/settings"
              active={isActive('/app/settings')}
              onClick={handleLinkClick}
            >
              <GearIcon className="w-3 h-3 mr-3" />
              Configurações
            </DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>

        <DashboardSidebarNav className="mt-auto">
          <DashboardSidebarNavHeader>
            <DashboardSidebarNavHeaderTitle>
              Links extras
            </DashboardSidebarNavHeaderTitle>
          </DashboardSidebarNavHeader>
          <DashboardSidebarNavMain>
            <DashboardSidebarNavLink href="/" onClick={handleLinkClick}>
              Precisa de ajuda?
            </DashboardSidebarNavLink>
            <DashboardSidebarNavLink href="/" onClick={handleLinkClick}>Site</DashboardSidebarNavLink>
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
      </DashboardSidebarMain>
      <DashboardSidebarFooter>
        <UserDropdown user={user} />
      </DashboardSidebarFooter>
    </DashboardSidebar>
  )
}