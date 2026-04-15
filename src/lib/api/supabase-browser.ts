/**
 * 浏览器端 Supabase 客户端（匿名密钥，受 RLS 保护）
 * 仅在客户端组件（'use client'）中使用
 * src/lib/api/supabase-browser.ts
 */
import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase browser environment variables')
  }

  return createBrowserClient(url, anonKey)
}
