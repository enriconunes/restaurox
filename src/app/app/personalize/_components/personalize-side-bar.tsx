'use client'

import {
  DashboardSidebarNav,
  DashboardSidebarNavLink,
  DashboardSidebarNavMain,
} from '@/components/dashboard/sidebar'
import { usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export function PersonalizeSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  const links = [
    { href: '/app/personalize', label: 'Dados do restaurante' },
    { href: '/app/personalize/time', label: 'Definir horários' },
    { href: '/app/personalize/theme', label: 'Tema do cardápio' },
  ]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <DashboardSidebarNav>
          <DashboardSidebarNavMain>
            {links.map((link) => (
              <DashboardSidebarNavLink
                key={link.href}
                href={link.href}
                active={isActive(link.href)}
              >
                {link.label}
              </DashboardSidebarNavLink>
            ))}
          </DashboardSidebarNavMain>
        </DashboardSidebarNav>
      </aside>

      {/* Mobile tabs */}
      <div className="lg:hidden w-full mb-6">
        <Tabs defaultValue={pathname} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            {links.map((link) => (
              <TabsTrigger key={link.href} value={link.href} asChild>
                <Link href={link.href}>{link.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  )
}