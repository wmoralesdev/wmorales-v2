import { Sparkles } from 'lucide-react';
import { InnerHero } from '@/components/common/inner-hero';
import { GuestbookContent } from '@/components/guestbook/guestbook-content';

export { metadata } from './metadata';

export default function GuestbookPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <InnerHero
        description="Create your unique conference-style ticket with AI-generated colors based on your mood"
        icon={Sparkles}
        title="Digital Guestbook"
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 pt-16">
        <GuestbookContent />
      </div>
    </div>
  );
}
