'use client';

import { SurveyRenderer } from '@/components/surveys/survey-renderer';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Mock survey data - this will come from the database
const mockSurvey = {
  id: '1',
  title: 'Developer Experience Survey',
  description: 'Help us understand your development workflow and preferences',
  sections: [
    {
      id: '1',
      title: 'About You',
      description: 'Tell us a bit about yourself',
      questions: [
        {
          id: '1',
          question: 'What is your name?',
          type: 'text',
          required: true,
          placeholder: 'Enter your name',
        },
        {
          id: '2',
          question: 'Are you a developer or investor?',
          type: 'radio',
          required: true,
          options: [
            {
              label: 'Developer',
              value: 'developer',
              path: 'developer-section',
            },
            {
              label: 'Investor',
              value: 'investor',
              path: 'investor-section',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      path: 'developer-section',
      title: 'Developer Questions',
      description: 'Questions specific to developers',
      questions: [
        {
          id: '3',
          question: 'What is your favorite programming language?',
          type: 'text',
          required: true,
          placeholder: 'e.g., TypeScript, Python, Go',
        },
        {
          id: '4',
          question: 'How many years of experience do you have?',
          type: 'select',
          required: true,
          options: [
            { label: 'Less than 1 year', value: '0-1' },
            { label: '1-3 years', value: '1-3' },
            { label: '3-5 years', value: '3-5' },
            { label: '5-10 years', value: '5-10' },
            { label: 'More than 10 years', value: '10+' },
          ],
        },
      ],
    },
    {
      id: '3',
      path: 'investor-section',
      title: 'Investor Questions',
      description: 'Questions specific to investors',
      questions: [
        {
          id: '5',
          question: 'What is your investment focus?',
          type: 'checkbox',
          required: true,
          options: [
            { label: 'Early Stage', value: 'early-stage' },
            { label: 'Growth Stage', value: 'growth-stage' },
            { label: 'Late Stage', value: 'late-stage' },
            { label: 'Public Markets', value: 'public-markets' },
          ],
        },
        {
          id: '6',
          question: 'What is your typical investment size?',
          type: 'text',
          required: true,
          placeholder: 'e.g., $50k-$500k',
        },
      ],
    },
  ],
};

export default function SurveyFillPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const supabase = createClient();
        // For now, using mock data
        setSurvey(mockSurvey);
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
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-full mb-8" />
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