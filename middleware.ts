import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Rotas protegidas que precisam de autenticação
  const protectedPaths = ['/feed', '/criar-post', '/descobrir', '/perfil']
  const authPaths = ['/login', '/cadastro']
  
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )

  try {
    // Criar cliente Supabase para middleware
    const supabase = createMiddlewareClient({ req, res })
    
    // Atualizar session se necessário
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Se usuário logado tenta acessar páginas de auth, redireciona para feed
    if (session && isAuthPath) {
      return NextResponse.redirect(new URL('/feed', req.url))
    }

    // Se usuário não logado tenta acessar rotas protegidas, redireciona para login
    if (!session && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return res
  } catch (e) {
    // Se houve erro na verificação da session, permite continuar
    return res
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}