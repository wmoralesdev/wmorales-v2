'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Github, Mail, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { authService } from '@/lib/auth'
import { OTPForm } from './otp-form'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailFormData = z.infer<typeof emailSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirectTo') || '/'
  
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [email, setEmail] = useState('')

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleProviderSignIn = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true)
      await authService.signInWithProvider(provider, redirectUrl)
      // OAuth will redirect automatically
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true)
      await authService.signInWithOTP(data.email)
      setEmail(data.email)
      setShowOTPForm(true)
      toast.success('Verification code sent! Check your email.')
    } catch (error) {
      console.error('OTP error:', error)
      toast.error('Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSuccess = () => {
    toast.success('Successfully signed in!')
    router.push(redirectUrl)
  }

  const handleBackToEmail = () => {
    setShowOTPForm(false)
    setEmail('')
    form.reset()
  }

  if (showOTPForm) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Enter verification code</h1>
          <p className="text-sm text-muted-foreground">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>
        
        <OTPForm
          email={email}
          onSuccess={handleOTPSuccess}
          onBack={handleBackToEmail}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Choose your preferred method to sign in
        </p>
        {redirectUrl !== '/' && (
          <p className="text-xs text-muted-foreground">
            You'll be redirected after signing in
          </p>
        )}
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="providers">Quick Sign In</TabsTrigger>
          <TabsTrigger value="email">Email Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="providers" className="space-y-4 mt-6">
          <div className="space-y-3">
            <Button
              onClick={() => handleProviderSignIn('github')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Github className="h-4 w-4 mr-2" />
              Continue with GitHub
            </Button>

            <Button
              onClick={() => handleProviderSignIn('google')}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-2" />
              Continue with Google
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Sending...' : 'Send verification code'}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
      </div>
    </div>
  )
}