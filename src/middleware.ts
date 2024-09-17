import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from '@/lib/get-url'

// middleware para controle de paginas privadas

export function middleware(request: NextRequest) {

    const token = request.cookies.get('authjs.session-token') ? request.cookies.get('authjs.session-token') : request.cookies.get('_Secure-authjs.session-token')
    const pathname = request.nextUrl.pathname

    // se estiver na pagina auth e tiver um token ativo, redireciona para /app
    if (pathname === '/auth' && token) {
    return NextResponse.redirect(new URL(getUrl('/app')))
    }

    // se tiver em /app ou /app/...pagina e nao tiver um token, redireciona para o login
    // todas as paginas seguidas de app serao privadas
    if (pathname.includes('/app') && !token) {
    return NextResponse.redirect(new URL(getUrl('/auth')))
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}