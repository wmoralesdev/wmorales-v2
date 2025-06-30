'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { authService } from '@/lib/auth'

const otpSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
})

type OTPFormData = z.infer<typeof otpSchema>

interface OTPFormProps {
  email: string
  onSuccess: () => void
  onBack: () => void
}

export function OTPForm({ email, onSuccess, onBack }: OTPFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: '',
    },
  })

  const handleSubmit = async (data: OTPFormData) => {
    try {
      setIsLoading(true)
      await authService.verifyOTP(email, data.code)
      onSuccess()
    } catch (error) {
      console.error('OTP verification error:', error)
      toast.error('Invalid or expired code. Please try again.')
      form.reset()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      setIsResending(true)
      await authService.signInWithOTP(email)
      toast.success('New verification code sent!')
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-4">
                <FormLabel className="text-base">Verification Code</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    disabled={isLoading}
                  >
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
            type="submit"
            disabled={isLoading || form.watch('code').length !== 6}
            className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? 'Verifying...' : 'Verify code'}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col space-y-4 text-center">
        <Button
          variant="ghost"
          onClick={handleResendCode}
          disabled={isResending}
          className="text-sm"
        >
          {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
        </Button>
        
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-sm inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Use different email
        </Button>
      </div>
    </div>
  )
}