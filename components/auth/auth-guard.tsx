'use client'

import { useAuth } from './auth-provider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with current path as redirect URL
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
    }
  }, [loading, user, router, pathname])

  if (loading) {
    return fallback || <AuthLoadingSkeleton />
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}

function AuthLoadingSkeleton() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}