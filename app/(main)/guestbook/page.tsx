import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth/auth-guard';
import { GuestbookContent } from '@/components/guestbook-content';

export const metadata: Metadata = {
  title: 'Guestbook - Walter Morales',
  description: 'Sign my digital guestbook and customize your unique ticket with AI.',
};

export default function GuestbookPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-4xl">Guestbook</h1>
          <p className="text-muted-foreground">Create your ticket and see what others have to share</p>
        </div>
        <GuestbookContent />
      </div>
    </AuthGuard>
  );
}
