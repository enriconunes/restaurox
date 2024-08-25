import { cn } from '@/lib/utils'

// este componente deve ser aplicado em todas as paginas para manter a formatacao
// em cada pagina, usar o padrao:
// return(
//         <DashboardPage>
//             <DashboardPageHeader>
//                 <DashboardPageHeaderTitle>AQUI É O TITULO DA PAGINA</DashboardPageHeaderTitle>
//             </DashboardPageHeader>
//             <DashboardPageMain>
//                 <h1>AQUI É O CONTEUDO DA PAGINA</h1>
//             </DashboardPageMain>
//         </DashboardPage>
//     )

export type DashboardPageGenericProps<T = unknown> = {
  children: React.ReactNode
  className?: string
} & T

export function DashboardPage({
  className,
  children,
}: DashboardPageGenericProps) {
  return <section className={cn(['h-screen', className])}>{children}</section>
}

export function DashboardPageHeader({
  className,
  children,
}: DashboardPageGenericProps) {
  return (
    <header
      className={cn([
        'px-6 h-12 border-b border-border flex items-center justify-between',
        className,
      ])}
    >
      {children}
    </header>
  )
}

export function DashboardPageHeaderTitle({
  className,
  children,
}: DashboardPageGenericProps) {
  return (
    <span
      className={cn(['text-xs text-muted-foreground uppercase', className])}
    >
      {children}
    </span>
  )
}

export function DashboardPageHeaderNav({
  className,
  children,
}: DashboardPageGenericProps) {
  return <nav className={cn(['', className])}>{children}</nav>
}

export function DashboardPageMain({
  className,
  children,
}: DashboardPageGenericProps) {
  return <main className={cn(['p-6', className])}>{children}</main>
}