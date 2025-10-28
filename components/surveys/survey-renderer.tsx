"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
// biome-ignore lint/performance/noNamespaceImport: Zod namespace import is standard pattern
import * as z from "zod";

import {
  completeSurveyResponse,
  createSurveyResponse,
  saveSurveyAnswer,
} from "@/app/actions/survey.actions";
import { Button } from "@/components/ui/button";

// Constants
const PERCENTAGE_MULTIPLIER = 100;
const ANIMATION_DELAY_INCREMENT = 0.1;

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import type {
  Question,
  SurveyQuestion,
  SurveySection,
  SurveyWithSections,
} from "@/lib/types/survey.types";
import { QuestionRenderer } from "./question-renderer";

type SurveyRendererProps = {
  survey: SurveyWithSections;
};

export function SurveyRenderer({ survey }: SurveyRendererProps) {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionPath, setSectionPath] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseId, setResponseId] = useState<string | null>(null);

  const getCurrentSection = (): SurveySection => {
    if (currentSectionIndex === 0) {
      return survey.sections[0];
    }

    const currentPath = sectionPath[currentSectionIndex - 1];
    const section = survey.sections.find((s) => s.path === currentPath);

    if (!section) {
      return survey.sections[currentSectionIndex] || survey.sections.at(-1);
    }

    return section;
  };

  const currentSection = getCurrentSection();
  const totalSections = sectionPath.length + 1;
  const progress =
    ((currentSectionIndex + 1) / totalSections) * PERCENTAGE_MULTIPLIER;

  // Create dynamic schema based on current section questions
  const getQuestionSchema = (question: SurveyQuestion): z.ZodTypeAny => {
    const schemas = {
      text: () =>
        question.required
          ? z.string().min(1, "This field is required")
          : z.string().optional(),
      textarea: () =>
        question.required
          ? z.string().min(1, "This field is required")
          : z.string().optional(),
      radio: () =>
        question.required
          ? z.string().min(1, "Please select an option")
          : z.string().optional(),
      select: () =>
        question.required
          ? z.string().min(1, "Please select an option")
          : z.string().optional(),
      checkbox: () =>
        question.required
          ? z.array(z.string()).min(1, "Please select at least one option")
          : z.array(z.string()).optional(),
    } as const;

    return schemas[question.type]?.() ?? z.string().optional();
  };

  const createSchema = (questions: SurveyQuestion[]) => {
    const schemaObject = questions.reduce(
      (acc, question) => {
        acc[question.id] = getQuestionSchema(question);
        return acc;
      },
      {} as Record<string, z.ZodTypeAny>
    );

    return z.object(schemaObject);
  };

  const form = useForm({
    resolver: zodResolver(createSchema(currentSection.questions ?? [])),
    defaultValues: answers,
  });

  // Update form when section changes
  useEffect(() => {
    form.reset(answers);
  }, [answers, form, form.reset]);

  const findNextPath = (data: Record<string, string | string[]>): string | null => {
    for (const [questionId, answer] of Object.entries(data)) {
      const question = currentSection.questions?.find(
        (q) => q.id === questionId
      );
      const selectedOption = question?.options?.find(
        (opt) => opt.value === answer
      );
      if (selectedOption?.path) {
        return selectedOption.path;
      }
    }
    return null;
  };
  const isLastSection = (nextPath: string | null): boolean =>
    currentSectionIndex >= survey.sections.length - 1 ||
    Boolean(nextPath && !survey.sections.find((s) => s.path === nextPath));

  const handleSubmit = async () => {
    if (!responseId) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Complete the response (answers were already saved in handleNext)
      await completeSurveyResponse(responseId);

      // Redirect to thank you or results page
      router.push(`/surveys/${survey.id}?completed=true`);
    } catch (_error) {
      toast.error("Failed to submit survey");
    } finally {
      setIsSubmitting(false);
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: Dynamic form data from react-hook-form
  const handleNext = async (data: any) => {
    // Save answers locally
    const updatedAnswers = { ...answers, ...data };
    setAnswers(updatedAnswers);

    // Save answers to database for this section
    if (responseId) {
      await Promise.all(
        Object.entries(data).map(([questionId, answer]) =>
          saveSurveyAnswer(responseId, questionId, answer as string | string[])
        )
      );
    }

    // Check for path redirects and navigate
    const nextPath = findNextPath(data);
    if (nextPath) {
      setSectionPath([...sectionPath.slice(0, currentSectionIndex), nextPath]);
    }

    if (isLastSection(nextPath)) {
      await handleSubmit();
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

  return (
    <div className="app-container mx-auto max-w-4xl">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2 bg-gradient-to-r from-white to-purple-400 bg-clip-text font-bold text-3xl text-transparent">
          {survey.title}
        </h1>
        <p className="text-gray-400">{survey.description}</p>
      </motion.div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative h-2 overflow-hidden rounded-full bg-gray-800/50">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
            initial={{ width: 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-2 text-center text-gray-500 text-sm">
          Section {currentSectionIndex + 1} of {totalSections}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: 20 }}
          key={currentSection.id}
          transition={{ duration: 0.3 }}
        >
          {/* Section Header Card */}
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl text-white">
                <Info className="h-5 w-5 text-purple-400" />
                {currentSection.title}
              </CardTitle>
              {currentSection.description && (
                <CardDescription className="mt-2 text-gray-400 text-lg">
                  {currentSection.description}
                </CardDescription>
              )}
            </CardHeader>
          </Card>

          {/* Questions Form */}
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleNext)}
            >
              {currentSection.questions?.map((question, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  key={question.id}
                  transition={{
                    delay: ANIMATION_DELAY_INCREMENT * (index + 1),
                  }}
                >
                  <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30">
                    <CardContent>
                      <QuestionRenderer
                        form={form}
                        question={question as unknown as Question}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Navigation Buttons */}
              <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
                <CardContent className="">
                  <div className="flex justify-between">
                    <Button
                      className="border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
                      disabled={currentSectionIndex === 0}
                      onClick={handleBack}
                      type="button"
                      variant="outline"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>

                    <Button
                      className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {currentSectionIndex >= survey.sections.length - 1 ? (
                        <>
                          Submit Survey
                          <Check className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Next Section
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
