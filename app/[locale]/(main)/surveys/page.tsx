import { BarChart3 } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getActiveSurveys } from '@/app/actions/survey.actions';
import { InnerHero } from '@/components/common/inner-hero';
import { SurveysListClient } from '@/components/surveys/surveys-list-client';

export { metadata } from './metadata';

// Force dynamic rendering to avoid database calls during build
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SurveysPage({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations('surveys');
  const surveysResult = await getActiveSurveys();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <InnerHero
        description={t('description')}
        icon={BarChart3}
        title={t('title')}
      />

      <div className="container mx-auto px-4 py-8 pt-16">
        <SurveysListClient
          error={surveysResult.error}
          surveys={surveysResult.data || []}
        />
      </div>
    </div>
  );
}
