'use client';

import { LogIn } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './auth-provider';
import { UserNav } from './user-nav';

type SignInButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export function SignInButton({ variant = 'outline', size = 'default' }: SignInButtonProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const t = useTranslations('auth');

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
        {t('loading')}
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
          {t('signIn')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignInWithGoogle}>
          <Image alt="Google" height={16} src="/google.svg" width={16} />
          {t('google')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignInWithGitHub}>
          <Image alt="GitHub" height={16} src="/github.svg" width={16} />
          {t('github')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
