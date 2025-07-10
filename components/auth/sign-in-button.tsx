'use client';

import { LogIn } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import { UserNav } from './user-nav';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

type SignInButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export function SignInButton({ variant = 'outline', size = 'default' }: SignInButtonProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const supabase = createClient();

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}?redirectTo=${encodeURIComponent(pathname)}`,
      },
    });
  };

  const handleSignInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}?redirectTo=${encodeURIComponent(pathname)}`,
      },
    });
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignInWithGoogle}>
          <Image src="/google.svg" alt="Google" width={16} height={16} />
          Google
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignInWithGitHub}>
          <Image src="/github.svg" alt="GitHub" width={16} height={16} />
          GitHub
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
