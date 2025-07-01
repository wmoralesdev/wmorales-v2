'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Form } from '@/components/ui/form';
import { QuestionRenderer } from './question-renderer';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Survey {
  id: string;
  title: string;
  description: string;
  sections: Section[];
}

interface Section {
  id: string;
  path?: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'checkbox' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: Option[];
}

interface Option {
  label: string;
  value: string;
  path?: string;
}

interface SurveyRendererProps {
  survey: Survey;
}

export function SurveyRenderer({ survey }: SurveyRendererProps) {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionPath, setSectionPath] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the current section based on path logic
  const getCurrentSection = (): Section => {
    if (currentSectionIndex === 0) {
      return survey.sections[0];
    }

    // Find section by path
    const currentPath = sectionPath[currentSectionIndex - 1];
    const section = survey.sections.find(s => s.path === currentPath);
    
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
    
    questions.forEach(question => {
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
    // Save answers
    const updatedAnswers = { ...answers, ...data };
    setAnswers(updatedAnswers);

    // Check for path redirects based on answers
    let nextPath: string | null = null;
    
    for (const [questionId, answer] of Object.entries(data)) {
      const question = currentSection.questions.find(q => q.id === questionId);
      if (question && question.options) {
        const selectedOption = question.options.find(opt => opt.value === answer);
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
    const isLastSection = currentSectionIndex >= survey.sections.length - 1 || 
                         (nextPath && !survey.sections.find(s => s.path === nextPath));

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

  const handleSubmit = async (finalAnswers: any) => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // TODO: Save to database
      console.log('Survey submitted:', {
        surveyId: survey.id,
        answers: finalAnswers,
        completedAt: new Date().toISOString(),
      });

      // Redirect to thank you or results page
      router.push(`/surveys/${survey.id}?completed=true`);
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
        <p className="text-muted-foreground">{survey.description}</p>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Section {currentSectionIndex + 1} of {totalSections}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{currentSection.title}</CardTitle>
              <CardDescription>{currentSection.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
                  {currentSection.questions.map((question) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <QuestionRenderer
                        question={question}
                        form={form}
                      />
                    </motion.div>
                  ))}

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant={'outline' as const}
                      onClick={handleBack}
                      disabled={currentSectionIndex === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
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