import type { Metadata } from 'next'
import { Code2 } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Sign In - Walter Morales',
  description: 'Sign in to your account to access personalized features.',
}

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Code2 className="size-4" />
            </div>
            Walter Morales
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-purple-600/30 to-pink-600/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/60" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-10 text-center">
          <div className="max-w-md space-y-6">
            <Code2 className="mx-auto h-16 w-16 text-purple-400" />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">
                Welcome to my platform
              </h2>
              <p className="text-lg text-purple-100">
                Join me on this journey of building amazing digital experiences with cutting-edge technologies.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-purple-200">
              <span className="rounded-full border border-purple-300/30 px-3 py-1">Next.js 15</span>
              <span className="rounded-full border border-purple-300/30 px-3 py-1">TypeScript</span>
              <span className="rounded-full border border-purple-300/30 px-3 py-1">Supabase</span>
              <span className="rounded-full border border-purple-300/30 px-3 py-1">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}