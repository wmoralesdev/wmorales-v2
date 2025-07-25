import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getActiveSurveys, getSurveyWithSections } from '@/app/actions/survey.actions';
import { SurveyRenderer } from '@/components/surveys/survey-renderer';
import { routing } from '@/i18n/routing';
import { createMetadata, siteConfig } from '@/lib/metadata';
import type { SurveyWithSections } from '@/lib/types/survey.types';

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const result = await getActiveSurveys();
    if (result.error || !result.data) {
      return [];
    }

    const surveys = result.data;
    
    // Generate params for all locales and all surveys
    return routing.locales.flatMap((locale) =>
      surveys.map((survey) => ({
        locale,
        id: survey.id,
      }))
    );
  } catch (error) {
    // Error generating static params for surveys
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getSurveyWithSections(id);

  if (result.error || !result.data) {
    return createMetadata({
      title: 'Survey Not Found',
      description: 'The requested survey could not be found.',
    });
  }

  const survey = result.data as SurveyWithSections;
  const title = survey.title;
  const description =
    survey.description ||
    `Community survey: ${survey.title}. Share your thoughts and help shape the LATAM developer community.`;

  return createMetadata({
    title: `${title} - Survey`,
    description,
    openGraph: {
      title: `${title} | Community Survey`,
      description,
      url: `${siteConfig.url}/surveys/${id}/fill`,
      type: 'website',
    },
    twitter: {
      title: `${title} | Community Survey`,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/surveys/${id}/fill`,
    },
  });
}

export default async function SurveyFillPage({ params }: PageProps) {
  const { locale, id } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const result = await getSurveyWithSections(id);

  if (result.error || !result.data) {
    notFound();
  }

  const survey = result.data as SurveyWithSections;

  return (
    <div className="min-h-screen">
      <SurveyRenderer survey={survey} />
    </div>
  );
}
