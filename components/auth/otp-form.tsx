'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

interface OTPFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function OTPForm({ email, onSuccess, onBack }: OTPFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  });

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
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-4">
                <FormLabel className="text-base">Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field} disabled={isLoading}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="h-12 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-base hover:from-purple-700 hover:to-pink-700"
            disabled={isLoading || form.watch('code').length !== 6}
            type="submit"
          >
            {isLoading ? 'Verifying...' : 'Verify code'}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col space-y-4 text-center">
        <Button className="text-sm" disabled={isResending} onClick={handleResendCode} variant="ghost">
          {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
        </Button>

        <Button className="inline-flex items-center text-sm" onClick={onBack} variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Use different email
        </Button>
      </div>
    </div>
  );
}
