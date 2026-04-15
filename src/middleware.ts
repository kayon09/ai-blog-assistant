import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import type { NextRequest } from 'next/server'

// 需要登录才能访问的路由
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/api/generate(.*)'])

// 公开路由（第三方回调、健康检查等，不走 Clerk 认证）
const isPublicRoute = createRouteMatcher([
  '/api/webhooks/(.*)',  // Clerk / Stripe / 其他 Webhook 回调
  '/api/health',         // 健康检查
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  if (isPublicRoute(req)) return // 公开路由直接放行

  if (isProtectedRoute(req)) {
    const session = await auth()
    if (!session.userId) {
      return session.redirectToSignIn()
    }
  }
})

export const config = {
  matcher: [
    // 跳过 Next.js 内部路由和静态文件
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
  ],
}
