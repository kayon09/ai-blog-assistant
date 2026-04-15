import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { zhCN } from '@clerk/localizations'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'AI写作助手 — 30分钟完成一篇博客',
  description: '帮助博主和营销人员从0快速生成高质量中文博客，克服写作启动难。',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ClerkProvider
          localization={zhCN}
          appearance={{
            variables: {
              colorPrimary: '#B8860B',
              colorText: '#1A1A1A',
              borderRadius: '0px',
              fontFamily: "'Source Sans 3', sans-serif",
            },
            elements: {
              card: 'shadow-none border border-[#E8E5DF]',
              formButtonPrimary:
                'bg-[#1A1A1A] hover:bg-[#B8860B] transition-colors rounded-none text-[11px] tracking-widest uppercase font-mono',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
