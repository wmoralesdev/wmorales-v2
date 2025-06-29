'use client'

import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './auth-provider'
import { UserNav } from './user-nav'

interface SignInButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

export function SignInButton({ variant = 'outline', size = 'default' }: SignInButtonProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignIn = () => {
    router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
  }

  if (loading) {
    return <Button variant={variant} size={size} disabled>Loading...</Button>
  }

  if (user) {
    return <UserNav />
  }

  return (
    <Button variant={variant} size={size} onClick={handleSignIn}>
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  )
}