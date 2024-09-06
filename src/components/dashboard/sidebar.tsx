'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import Logo from '../logo'

export type DashboardSidebarGenericProps<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

export function DashboardSidebar({
  className,
  children,
  isOpen,
  setIsOpen,
}: DashboardSidebarGenericProps & {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background z-50 flex items-center justify-between px-4 border-b border-border">
        {/* <h2 className="text-lg font-semibold">Dashboard</h2> */}
        <div className='w-2/6'>
          <Logo />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar / Mobile Menu */}
      <aside
        className={cn([
          'fixed top-0 left-0 bottom-0 z-40 flex flex-col space-y-6 bg-background transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:w-64 lg:border-r lg:border-border',
          'lg:relative lg:flex', // Make it relative and always flex on large screens
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64',
          'lg:pt-0 pt-16', // Add padding top on mobile to account for the header
          className,
        ])}
      >
        {children}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

// O restante dos componentes permanece praticamente inalterado
export function DashboardSidebarHeader({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return (
    <header
      className={cn([
        'px-6 h-12 flex items-center border-b border-border',
        className,
      ])}
    >
      {children}
    </header>
  )
}

// titulo do header
export function DashboardSidebarHeaderTitle({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return <h2 className={cn(['', className])}>{children}</h2>
}

// conteudo principal
export function DashboardSidebarMain({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return <main className={cn(['px-3 flex-grow', className])}>{children}</main>
}

// navegacoes (links)
export function DashboardSidebarNav({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return <nav className={cn(['flex flex-col', className])}>{children}</nav>
}

// header da div dos links
export function DashboardSidebarNavHeader({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return <header className={cn(['', className])}>{children}</header>
}

// titulo do header das navegacoes
export function DashboardSidebarNavHeaderTitle({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return (
    <div
      className={cn([
        'text-[0.6rem] uppercase text-muted-foreground ml-3',
        className,
      ])}
    >
      {children}
    </div>
  )
}

// conteudo principal das navegacoes
export function DashboardSidebarNavMain({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return <main className={cn(['flex flex-col', className])}>{children}</main>
}

// tipagem de cada link de navegacao
// ao usar este link, é preciso passar o href e opcionalmente o active
type DashboardSidebarNavLinkProps = {
  href: string
  active?: boolean
  onClick?: () => void
}

// links individuais da nav
// possui os tipos DashboardSidebarGenericProps e DashboardSidebarNavLinkProps
export function DashboardSidebarNavLink({
  className,
  children,
  href,
  active,
  onClick,
}: DashboardSidebarGenericProps<DashboardSidebarNavLinkProps>) {
  return (
    <Link
      href={href}
      className={cn([
        'flex items-center text-xs px-3 py-2 rounded-md',
        active && 'bg-secondary',
        className,
      ])}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

export function DashboardSidebarFooter({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return (
    <footer className={cn(['p-6 mt-auto border-t border-border', className])}>
      {children}
    </footer>
  )
}