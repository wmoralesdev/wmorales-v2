'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuth } from './auth-provider';
import { UserNav } from './user-nav';

type SignInButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
};

export function SignInButton({
  variant = 'outline',
  size = 'default',
}: SignInButtonProps) {
  const { user, loading } = useAuth();
  const t = useTranslations('auth');

  if (loading) {
    return (
      <Button disabled size={size} variant={variant}>
        {t('loading')}
      </Button>
    );
  }

  console.log(user);

  if (user) {
    return <UserNav />;
  }

  return null;
}
