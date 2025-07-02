'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { completeSurveyResponse, createSurveyResponse, saveSurveyAnswer } from '@/app/actions/survey.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import type { Option, Question, Section, Survey } from '@/lib/types/survey.types';
import { QuestionRenderer } from './question-renderer';

type SurveyRendererProps = {
  survey: Survey & {
    sections: (Section & {
      questions: (Question & {
        options?: Option[];
      })[];
    })[];
  };
};

export function SurveyRenderer({ survey }: SurveyRendererProps) {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionPath, setSectionPath] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);

  // Get the current section based on path logic
  const getCurrentSection = (): Section => {
    if (currentSectionIndex === 0) {
      return survey.sections[0];
    }

    // Find section by path
    const currentPath = sectionPath[currentSectionIndex - 1];
    const section = survey.sections.find((s) => s.path === currentPath);

    if (!section) {
      // Fallback to sequential navigation
      return survey.sections[currentSectionIndex] || survey.sections[survey.sections.length - 1];
    }

    return section;
  };

  const currentSection = getCurrentSection();
  const totalSections = sectionPath.length + 1;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  // Create dynamic schema based on current section questions
  const createSchema = (questions: Question[]) => {
    const schemaObject: Record<string, any> = {};

    questions.forEach((question) => {
      if (question.type === 'text') {
        schemaObject[question.id] = question.required
          ? z.string().min(1, 'This field is required')
          : z.string().optional();
      } else if (question.type === 'radio' || question.type === 'select') {
        schemaObject[question.id] = question.required
          ? z.string().min(1, 'Please select an option')
          : z.string().optional();
      } else if (question.type === 'checkbox') {
        schemaObject[question.id] = question.required
          ? z.array(z.string()).min(1, 'Please select at least one option')
          : z.array(z.string()).optional();
      }
    });

    return z.object(schemaObject);
  };

  const form = useForm({
    resolver: zodResolver(createSchema(currentSection.questions)),
    defaultValues: answers,
  });

  // Update form when section changes
  useEffect(() => {
    form.reset(answers);
  }, [currentSectionIndex]);

  const handleNext = async (data: any) => {
    // Save answers locally
    const updatedAnswers = { ...answers, ...data };
    setAnswers(updatedAnswers);

    // Save answers to database for this section
    if (responseId) {
      for (const [questionId, answer] of Object.entries(data)) {
        await saveSurveyAnswer(responseId, questionId, answer as string | string[]);
      }
    }

    // Check for path redirects based on answers
    let nextPath: string | null = null;

    for (const [questionId, answer] of Object.entries(data)) {
      const question = currentSection.questions.find((q) => q.id === questionId);
      if (question && question.options) {
        const selectedOption = question.options.find((opt) => opt.value === answer);
        if (selectedOption && selectedOption.path) {
          nextPath = selectedOption.path;
          break;
        }
      }
    }

    // Navigate to next section
    if (nextPath) {
      setSectionPath([...sectionPath.slice(0, currentSectionIndex), nextPath]);
    }

    // Check if we're at the last section
    const isLastSection =
      currentSectionIndex >= survey.sections.length - 1 ||
      (nextPath && !survey.sections.find((s) => s.path === nextPath));

    if (isLastSection) {
      await handleSubmit(updatedAnswers);
    } else {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setSectionPath(sectionPath.slice(0, -1));
    }
  };

  // Create response when component mounts
  useEffect(() => {
    const initResponse = async () => {
      const result = await createSurveyResponse(survey.id);
      if (result.data) {
        setResponseId(result.data.id);
      }
    };

    if (!responseId) {
      initResponse();
    }
  }, [survey.id, responseId]);

  const handleSubmit = async (finalAnswers: any) => {
    if (!responseId) return;

    setIsSubmitting(true);
    try {
      // Complete the response (answers were already saved in handleNext)
      await completeSurveyResponse(responseId);

      // Redirect to thank you or results page
      router.push(`/surveys/${survey.id}?completed=true`);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">{survey.title}</h1>
        <p className="text-muted-foreground">{survey.description}</p>
      </div>

      <div className="mb-6">
        <Progress className="h-2" value={progress} />
        <p className="mt-2 text-muted-foreground text-sm">
          Section {currentSectionIndex + 1} of {totalSections}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: 20 }}
          key={currentSection.id}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{currentSection.title}</CardTitle>
              <CardDescription>{currentSection.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(handleNext)}>
                  {currentSection.questions.map((question) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 10 }}
                      key={question.id}
                      transition={{ delay: 0.1 }}
                    >
                      <QuestionRenderer form={form} question={question} />
                    </motion.div>
                  ))}

                  <div className="flex justify-between pt-6">
                    <Button
                      disabled={currentSectionIndex === 0}
                      onClick={handleBack}
                      type="button"
                      variant={'outline' as const}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button disabled={isSubmitting} type="submit">
                      {currentSectionIndex >= survey.sections.length - 1 ? (
                        <>
                          Submit
                          <Check className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
