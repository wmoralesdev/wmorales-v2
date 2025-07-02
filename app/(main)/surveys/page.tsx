import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getActiveSurveys } from '@/app/actions/survey.actions';
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';

async function SurveysList() {
  const { data: surveys, error } = await getActiveSurveys();
  
  if (error || !surveys) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load surveys. Please try again later.</p>
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No active surveys at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {surveys.map((survey: any) => (
        <Card key={survey.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{survey.title}</CardTitle>
            <CardDescription>{survey.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
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
              <Button variant="outline" size="icon" asChild>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Active Surveys</h1>
        <p className="text-muted-foreground">
          Participate in our surveys to help shape the future of our products
        </p>
      </div>
      
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
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
  );
}
