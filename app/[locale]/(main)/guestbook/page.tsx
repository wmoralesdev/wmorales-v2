import { Sparkles } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { InnerHero } from '@/components/common/inner-hero';
import { GuestbookContent } from '@/components/guestbook/guestbook-content';

export { metadata } from './metadata';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GuestbookPage({ params }: Props) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations('guestbook');
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <InnerHero
        description={t('description')}
        icon={Sparkles}
        title={t('title')}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-16 pb-16">
        <GuestbookContent />
      </div>
    </div>
  );
}
