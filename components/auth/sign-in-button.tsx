'use client';

import { LogIn } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import { UserNav } from './user-nav';

type SignInButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export function SignInButton({ variant = 'outline', size = 'default' }: SignInButtonProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignIn = () => {
    router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`);
  };

  if (loading) {
    return (
      <Button disabled size={size} variant={variant}>
        Loading...
      </Button>
    );
  }

  if (user) {
    return <UserNav />;
  }

  return (
    <Button onClick={handleSignIn} size={size} variant={variant}>
      <LogIn className="mr-2 h-4 w-4" />
      Sign In
    </Button>
  );
}
