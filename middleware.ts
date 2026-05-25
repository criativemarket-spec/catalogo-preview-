// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protege /admin exceto /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // A autenticação real é verificada client-side via Firebase Auth
    // Este middleware apenas garante que rotas /admin não sejam indexadas
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
