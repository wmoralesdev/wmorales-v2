import { Github, Mail, Vote } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/auth';

type PollSignInCardProps = {
  pollTitle: string;
  currentPath: string;
};

export function PollSignInCard({
  pollTitle,
  currentPath,
}: PollSignInCardProps) {
  const t = useTranslations('polls');
  const tAuth = useTranslations('auth');

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      await authService.signInWithProvider(provider, currentPath);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Card className="mx-auto max-w-md border-gray-800 bg-gray-900/80 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3">
            <Vote className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <CardTitle className="text-2xl text-white">
          {t('signInTitle')}
        </CardTitle>
        <p className="text-muted-foreground">
          {t('signInDescription', { pollTitle })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="h-12 w-full border-2 border-gray-700 text-base transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/10"
          onClick={() => handleSignIn('github')}
          variant="outline"
        >
          <Github className="mr-3 h-5 w-5" />
          {tAuth('continueWith', { provider: 'GitHub' })}
        </Button>

        <Button
          className="h-12 w-full border-2 border-gray-700 text-base transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/10"
          onClick={() => handleSignIn('google')}
          variant="outline"
        >
          <Mail className="mr-3 h-5 w-5" />
          {tAuth('continueWith', { provider: 'Google' })}
        </Button>

        <div className="pt-4 text-center">
          <p className="text-muted-foreground text-xs">{t('signInTerms')}</p>
        </div>
      </CardContent>
    </Card>
  );
}
