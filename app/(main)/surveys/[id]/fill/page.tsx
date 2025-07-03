import { notFound } from 'next/navigation';
import { getSurveyWithSections } from '@/app/actions/survey.actions';
import { SurveyRenderer } from '@/components/surveys/survey-renderer';
import type { SurveyWithSections } from '@/lib/types/survey.types';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SurveyFillPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getSurveyWithSections(id);

  if (result.error || !result.data) {
    notFound();
  }

  const survey = result.data as SurveyWithSections;

  return <SurveyRenderer survey={survey} />;
}
