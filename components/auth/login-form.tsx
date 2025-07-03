'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
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

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      type: 'spring' as const,
      stiffness: 300,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const iconVariants: Variants = {
  rest: { rotate: 0 },
  hover: {
    rotate: 15,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const shieldVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 2,
    },
  },
};

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
      <motion.div animate="visible" className="space-y-6" initial="hidden" variants={containerVariants}>
        <motion.div className="space-y-2 text-center" variants={itemVariants}>
          <motion.div className="mb-4 flex justify-center" transition={{ duration: 0.2 }} whileHover={{ scale: 1.05 }}>
            <motion.div animate="animate" className="rounded-full bg-purple-500/20 p-3" variants={shieldVariants}>
              <Shield className="h-8 w-8 text-purple-400" />
            </motion.div>
          </motion.div>
          <h1 className="font-semibold text-2xl tracking-tight">Enter verification code</h1>
          <p className="text-muted-foreground text-sm">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <OTPForm email={email} onBack={handleBackToEmail} onSuccess={handleOTPSuccess} />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div animate="visible" className="space-y-6" initial="hidden" variants={containerVariants}>
      <motion.div className="space-y-2 text-center" variants={itemVariants}>
        <h1 className="font-semibold text-2xl tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Choose your preferred method to sign in</p>
        <AnimatePresence>
          {redirectUrl !== '/' && (
            <motion.p
              animate={{ opacity: 1, height: 'auto' }}
              className="text-muted-foreground text-xs"
              exit={{ opacity: 0, height: 0 }}
              initial={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              You'll be redirected after signing in
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs className="w-full" defaultValue="providers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="providers">Quick Sign In</TabsTrigger>
            <TabsTrigger value="email">Email Code</TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6 space-y-4" value="providers">
            <motion.div animate="visible" className="space-y-3" initial="hidden" variants={containerVariants}>
              <motion.div initial="rest" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleProviderSignIn('github')}
                  variant="outline"
                >
                  <motion.div className="mr-2" variants={iconVariants}>
                    <Github className="h-4 w-4" />
                  </motion.div>
                  Continue with GitHub
                </Button>
              </motion.div>

              <motion.div initial="rest" variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => handleProviderSignIn('google')}
                  variant="outline"
                >
                  <motion.div className="mr-2" variants={iconVariants}>
                    <Mail className="h-4 w-4" />
                  </motion.div>
                  Continue with Google
                </Button>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent className="mt-6 space-y-4" value="email">
            <Form {...form}>
              <motion.form
                animate="visible"
                className="space-y-4"
                initial="hidden"
                onSubmit={form.handleSubmit(handleEmailSubmit)}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <motion.div transition={{ duration: 0.2 }} whileFocus={{ scale: 1.02 }}>
                            <Input placeholder="your.email@example.com" type="email" {...field} />
                          </motion.div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                <motion.div initial="rest" variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button className="w-full" disabled={isLoading} type="submit">
                    {isLoading ? (
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        Sending...
                      </motion.span>
                    ) : (
                      'Send verification code'
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            </Form>
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div className="text-center" variants={itemVariants}>
        <motion.div className="inline-block" transition={{ duration: 0.2 }} whileHover={{ x: -5 }}>
          <Link
            className="inline-flex items-center text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/"
          >
            <motion.div className="mr-2" transition={{ duration: 0.2 }} whileHover={{ x: -2 }}>
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
