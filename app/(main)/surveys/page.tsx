import { ArrowRight, BarChart3, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { getActiveSurveys } from '@/app/actions/survey.actions';
import { InnerHero } from '@/components/inner-hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

async function SurveysList() {
  const { data: surveys, error } = await getActiveSurveys();

  if (error || !surveys) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Failed to load surveys. Please try again later.</p>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No active surveys at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/** biome-ignore lint/suspicious/noExplicitAny: form data is dynamic */}
      {surveys.map((survey: any) => (
        <Card className="transition-shadow hover:shadow-lg" key={survey.id}>
          <CardHeader>
            <CardTitle>{survey.title}</CardTitle>
            <CardDescription>{survey.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <span>Status: {survey.status}</span>
              <span>{new Date(survey.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link href={`/surveys/${survey.id}/fill`}>
                  Take Survey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="icon" variant="outline">
                <Link href={`/surveys/${survey.id}`}>
                  <BarChart3 className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SurveysPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <InnerHero
        description="Participate in our surveys to help shape the future of our community"
        icon={Sparkles}
        title="Active Surveys"
      />

      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          }
        >
          <SurveysList />
        </Suspense>
      </div>
    </div>
  );
}
