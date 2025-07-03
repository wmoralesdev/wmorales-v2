import { notFound } from 'next/navigation';
import { getSurveyWithSections } from '@/app/actions/survey.actions';
import { SurveyRenderer } from '@/components/surveys/survey-renderer';
import type { SurveyWithSections } from '@/lib/types/survey.types';

export default async function SurveyFillPage({ params }: { params: { id: string } }) {
  const result = await getSurveyWithSections(params.id);

  if (result.error || !result.data) {
    notFound();
  }

  const survey = result.data as SurveyWithSections;

  return <SurveyRenderer survey={survey} />;
}
