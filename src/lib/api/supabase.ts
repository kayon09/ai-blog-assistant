/**
 * @deprecated 此文件已废弃。
 * - 浏览器端：使用 @/lib/api/supabase-browser 的 createSupabaseBrowserClient()
 * - 服务端：  使用 @/lib/api/supabase-server 的 createSupabaseServerClient()
 * - 管理员：  使用 @/lib/api/supabase-server 的 createSupabaseAdminClient()
 *
 * 原因：混用单一实例会导致服务端/客户端 session 错乱，详见 code-review C-1。
 */
export { createSupabaseBrowserClient as createBrowserClient } from './supabase-browser'
export { createSupabaseServerClient as createServerClient, createSupabaseAdminClient as createAdminClient } from './supabase-server'
