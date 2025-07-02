'use client';

import { AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSurveyWithSections } from '@/app/actions/survey.actions';
import { SurveyRenderer } from '@/components/surveys/survey-renderer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import type { SurveyWithSections } from '@/lib/types/survey.types';

export default function SurveyFillPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<SurveyWithSections | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const surveyId = params.id as string;
        const result = await getSurveyWithSections(surveyId);

        if (result.error || !result.data) {
          setError(result.error || 'Failed to load survey');
        } else {
          setSurvey(result.data as SurveyWithSections);
        }
      } catch (err) {
        setError('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-12 w-3/4" />
        <Skeleton className="mb-8 h-6 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Survey not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <SurveyRenderer survey={survey} />;
}
