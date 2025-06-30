'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Github, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/lib/auth';
import { OTPForm } from './otp-form';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirectTo') || '/';

  const [isLoading, setIsLoading] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleProviderSignIn = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      await authService.signInWithProvider(provider, redirectUrl);
      // OAuth will redirect automatically
    } catch (_error) {
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);
      await authService.signInWithOTP(data.email);
      setEmail(data.email);
      setShowOTPForm(true);
      toast.success('Verification code sent! Check your email.');
    } catch (_error) {
      toast.error('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    toast.success('Successfully signed in!');
    router.push(redirectUrl);
  };

  const handleBackToEmail = () => {
    setShowOTPForm(false);
    setEmail('');
    form.reset();
  };

  if (showOTPForm) {
    return (
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-purple-500/20 p-3">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <h1 className="font-semibold text-2xl tracking-tight">Enter verification code</h1>
          <p className="text-muted-foreground text-sm">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <OTPForm email={email} onBack={handleBackToEmail} onSuccess={handleOTPSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Choose your preferred method to sign in</p>
        {redirectUrl !== '/' && <p className="text-muted-foreground text-xs">You'll be redirected after signing in</p>}
      </div>

      <Tabs className="w-full" defaultValue="providers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="providers">Quick Sign In</TabsTrigger>
          <TabsTrigger value="email">Email Code</TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6 space-y-4" value="providers">
          <div className="space-y-3">
            <Button
              className="w-full"
              disabled={isLoading}
              onClick={() => handleProviderSignIn('github')}
              variant="outline"
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>

            <Button
              className="w-full"
              disabled={isLoading}
              onClick={() => handleProviderSignIn('google')}
              variant="outline"
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>
        </TabsContent>

        <TabsContent className="mt-6 space-y-4" value="email">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleEmailSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? 'Sending...' : 'Send verification code'}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Link
          className="inline-flex items-center text-muted-foreground text-sm transition-colors hover:text-foreground"
          href="/"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
