'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function getActiveSurveys() {
  try {
    const surveys = await prisma.survey.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: surveys, error: null };
  } catch (error) {
    console.error('Error fetching active surveys:', error);
    return { data: null, error: 'Failed to fetch surveys' };
  }
}

export async function getSurveyWithSections(surveyId: string) {
  try {
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        sections: {
          orderBy: { sectionOrder: 'asc' },
          include: {
            questions: {
              orderBy: { questionOrder: 'asc' },
              include: {
                options: {
                  orderBy: { optionOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!survey) {
      return { data: null, error: 'Survey not found' };
    }

    return { data: survey, error: null };
  } catch (error) {
    console.error('Error fetching survey:', error);
    return { data: null, error: 'Failed to fetch survey' };
  }
}

export async function createSurveyResponse(surveyId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const sessionId = user?.id ? null : crypto.randomUUID();

    const response = await prisma.surveyResponse.create({
      data: {
        surveyId,
        userId: user?.id || null,
        sessionId,
      },
    });

    return { data: response, error: null };
  } catch (error) {
    console.error('Error creating survey response:', error);
    return { data: null, error: 'Failed to create response' };
  }
}

export async function saveSurveyAnswer(responseId: string, questionId: string, answer: string | string[]) {
  try {
    // Create the answer
    const surveyAnswer = await prisma.surveyAnswer.create({
      data: {
        responseId,
        questionId,
        answerText: Array.isArray(answer) ? null : answer,
      },
    });

    // If it's a checkbox answer with multiple selections
    if (Array.isArray(answer) && answer.length > 0) {
      const options = await prisma.surveyQuestionOption.findMany({
        where: {
          questionId,
          value: { in: answer },
        },
      });

      if (options.length > 0) {
        await prisma.surveyAnswerOption.createMany({
          data: options.map((option) => ({
            answerId: surveyAnswer.id,
            optionId: option.id,
          })),
        });
      }
    }

    return { data: surveyAnswer, error: null };
  } catch (error) {
    console.error('Error saving answer:', error);
    return { data: null, error: 'Failed to save answer' };
  }
}

export async function completeSurveyResponse(responseId: string) {
  try {
    const response = await prisma.surveyResponse.update({
      where: { id: responseId },
      data: {
        completedAt: new Date(),
      },
    });

    // Revalidate the survey page to update results
    revalidatePath('/surveys');

    return { data: response, error: null };
  } catch (error) {
    console.error('Error completing response:', error);
    return { data: null, error: 'Failed to complete response' };
  }
}

export async function getSurveyResults(surveyId: string) {
  try {
    const responses = await prisma.surveyResponse.findMany({
      where: {
        surveyId,
        completedAt: { not: null },
      },
      include: {
        answers: {
          include: {
            question: true,
            selectedOptions: {
              include: {
                option: true,
              },
            },
          },
        },
      },
    });

    // Process results for analytics
    const totalResponses = responses.length;
    const questionStats = new Map();

    for (const response of responses) {
      for (const answer of response.answers) {
        const questionId = answer.questionId;

        if (!questionStats.has(questionId)) {
          questionStats.set(questionId, {
            question: answer.question,
            responses: [],
          });
        }

        if (answer.answerText) {
          questionStats.get(questionId).responses.push(answer.answerText);
        } else if (answer.selectedOptions.length > 0) {
          for (const selectedOption of answer.selectedOptions) {
            questionStats.get(questionId).responses.push(selectedOption.option.value);
          }
        }
      }
    }

    return {
      data: {
        totalResponses,
        responses,
        questionStats: Array.from(questionStats.entries()),
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return { data: null, error: 'Failed to fetch results' };
  }
}
