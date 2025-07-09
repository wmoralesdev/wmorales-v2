import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { InnerHero } from '@/components/common/inner-hero';
import { GuestbookContent } from '@/components/guestbook/guestbook-content';

export const metadata: Metadata = {
  title: 'Guestbook - Walter Morales',
  description: 'Sign my digital guestbook and customize your unique ticket with AI.',
};

export default function GuestbookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Hero Section */}
      <InnerHero
        description="Create your unique conference-style ticket with AI-generated colors based on your mood"
        icon={Sparkles}
        title="Digital Guestbook"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <GuestbookContent />
      </div>
    </div>
  );
}
