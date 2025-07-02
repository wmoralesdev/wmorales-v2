import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/auth-guard';
import { GuestbookContent } from '@/components/guestbook-content';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Guestbook - Walter Morales',
  description: 'Sign my digital guestbook and customize your unique ticket with AI.',
};

export default async function GuestbookPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return (
    <AuthGuard>
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 animate-fade-in-up font-bold text-4xl sm:text-5xl">
              <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Guestbook
              </span>
            </h1>
            <p className="animate-delay-200 animate-fade-in-up text-lg text-muted-foreground sm:text-xl">
              {user ? 'Here is your ticket' : 'Sign in and leave your mark with a personalized ticket'}
            </p>
          </div>

          <GuestbookContent />
        </div>
      </div>
    </AuthGuard>
  );
}
