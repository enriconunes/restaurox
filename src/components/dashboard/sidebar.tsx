import Link from 'next/link'

import { cn } from '@/lib/utils'

// tipo generico usado em todos os componentes que montam a sidebar
// todos os componentes devem receber um children que será o seu conteudo
// alem do children, recebe a propriedade className que é opcional
// essa propriedade permite estilizar cada componente individualmente na sua chamada
// caso tenha dois DashboardSidebarHeaderTitle, é possivel aplicar classes diferentes para cada um, alem das classes definidas por padrao aqui

// 'cn' do trecho 'className={cn(['', className])}' de cada componente é uma funcao do shadcn
// permite que una as classes passadas no primeiro parametro ('') com as classes passadas como parametro na chamada do componente do componente.
// o primeiro parametro fica fixo para todas as chamadas, enquanto o segundo é individual para cada um 

export type DashboardSidebarGenericProps<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

// componente que engloba todos os outros
export function DashboardSidebar({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return (
    <aside
      className={cn([
        'border-r border-border flex flex-col space-y-6 bg-secondary/5',
        className,
      ])}
    >
      {children}
    </aside>
  )
}

// header do sidebar
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
  return <main className={cn(['px-3', className])}>{children}</main>
}

// navegacoes (links)
export function DashboardSidebarNav({
  className,
  children,
}: DashboardSidebarGenericProps) {
  return <nav className={cn(['', className])}>{children}</nav>
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
}

// links individuais da nav
// possui os tipos DashboardSidebarGenericProps e DashboardSidebarNavLinkProps
export function DashboardSidebarNavLink({
  className,
  children,
  href,
  active,
}: DashboardSidebarGenericProps<DashboardSidebarNavLinkProps>) {
  return (
    <Link
      href={href}
      className={cn([
        'flex items-center text-xs px-3 py-2 rounded-md',
        active && 'bg-secondary',
        className,
      ])}
    >
      {children}
    </Link>
  )
}

// footer do sidebar
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