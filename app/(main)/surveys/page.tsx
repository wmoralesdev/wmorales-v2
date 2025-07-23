import { BarChart3 } from 'lucide-react';
import { getActiveSurveys } from '@/app/actions/survey.actions';
import { InnerHero } from '@/components/common/inner-hero';
import { SurveysListClient } from '@/components/surveys/surveys-list-client';

export { metadata } from './metadata';

export default async function SurveysPage() {
  const surveysResult = await getActiveSurveys();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <InnerHero
        description="Participate in our surveys to help shape the future of our community"
        icon={BarChart3}
        title="Active Surveys"
      />

      <div className="container mx-auto px-4 py-8 pt-16">
        <SurveysListClient error={surveysResult.error} surveys={surveysResult.data || []} />
      </div>
    </div>
  );
}
