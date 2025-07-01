'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { authService } from '@/lib/auth';

const otpSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type OTPFormData = z.infer<typeof otpSchema>;

type OTPFormProps = {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
};

export function OTPForm({ email, onSuccess, onBack }: OTPFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const buttonVariants = {
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

  const slotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        type: 'spring' as const,
        stiffness: 200,
      },
    }),
  };

  const handleSubmit = async (data: OTPFormData) => {
    try {
      setIsLoading(true);
      await authService.verifyOTP(email, data.code);
      onSuccess();
    } catch (_error) {
      toast.error('Invalid or expired code. Please try again.');
      form.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResending(true);
      await authService.signInWithOTP(email);
      toast.success('New verification code sent!');
    } catch (_error) {
      toast.error('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <motion.div animate="visible" className="space-y-6" initial="hidden" variants={containerVariants}>
      <Form {...form}>
        <motion.form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)} variants={itemVariants}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-4">
                <FormLabel className="text-base">Verification Code</FormLabel>
                <FormControl>
                  <motion.div transition={{ duration: 0.2 }} whileHover={{ scale: 1.02 }}>
                    <InputOTP maxLength={6} {...field} disabled={isLoading}>
                      <InputOTPGroup>
                        <motion.div custom={0} variants={slotVariants}>
                          <InputOTPSlot index={0} />
                        </motion.div>
                        <motion.div custom={1} variants={slotVariants}>
                          <InputOTPSlot index={1} />
                        </motion.div>
                        <motion.div custom={2} variants={slotVariants}>
                          <InputOTPSlot index={2} />
                        </motion.div>
                      </InputOTPGroup>
                      <motion.div
                        animate={{ scale: 1 }}
                        initial={{ scale: 0 }}
                        transition={{ delay: 0.3, duration: 0.2 }}
                      >
                        <InputOTPSeparator />
                      </motion.div>
                      <InputOTPGroup>
                        <motion.div custom={3} variants={slotVariants}>
                          <InputOTPSlot index={3} />
                        </motion.div>
                        <motion.div custom={4} variants={slotVariants}>
                          <InputOTPSlot index={4} />
                        </motion.div>
                        <motion.div custom={5} variants={slotVariants}>
                          <InputOTPSlot index={5} />
                        </motion.div>
                      </InputOTPGroup>
                    </InputOTP>
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.div initial="rest" variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              className="h-12 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-base hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading || form.watch('code').length !== 6}
              type="submit"
            >
              {isLoading ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  Verifying...
                </motion.span>
              ) : (
                'Verify code'
              )}
            </Button>
          </motion.div>
        </motion.form>
      </Form>

      <motion.div className="flex flex-col space-y-4 text-center" variants={itemVariants}>
        <motion.div transition={{ duration: 0.2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="text-sm" disabled={isResending} onClick={handleResendCode} variant="ghost">
            {isResending ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                Sending...
              </motion.span>
            ) : (
              "Didn't receive the code? Resend"
            )}
          </Button>
        </motion.div>

        <motion.div transition={{ duration: 0.2 }} whileHover={{ x: -5 }}>
          <Button className="inline-flex items-center text-sm" onClick={onBack} variant="ghost">
            <motion.div className="mr-2" transition={{ duration: 0.2 }} whileHover={{ x: -2 }}>
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
            Use different email
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
