export { auth as middleware } from '@/lib/auth'

export const config = {
    // Routes protégées par le middleware
    matcher: [
        '/cart/:path*',
        '/store/:path*',
        '/admin/:path*',
        '/checkout/:path*',
        '/orders/:path*',
        '/create-store/:path*',
    ],
}
