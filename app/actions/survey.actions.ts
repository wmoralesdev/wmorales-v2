"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db-utils";
import { createClient } from "@/lib/supabase/server";

export async function getActiveSurveys() {
  try {
    const surveys = await db.query(() =>
      db.client.survey.findMany({
        where: {
          status: "active",
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    return { data: surveys, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch surveys" };
  }
}

export async function getSurveyWithSections(surveyId: string) {
  try {
    const survey = await db.query(() =>
      db.client.survey.findUnique({
        where: { id: surveyId },
        include: {
          sections: {
            orderBy: { sectionOrder: "asc" },
            include: {
              questions: {
                orderBy: { questionOrder: "asc" },
                include: {
                  options: {
                    orderBy: { optionOrder: "asc" },
                  },
                },
              },
            },
          },
        },
      })
    );

    if (!survey) {
      return { data: null, error: "Survey not found" };
    }

    return { data: survey, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to fetch survey" };
  }
}

export async function createSurveyResponse(surveyId: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const sessionId = user?.id ? null : crypto.randomUUID();

    const response = await db.query(() =>
      db.client.surveyResponse.create({
        data: {
          surveyId,
          profileId: user?.id || null,
          sessionId,
        },
      })
    );

    return { data: response, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to create response" };
  }
}

export async function saveSurveyAnswer(
  responseId: string,
  questionId: string,
  answer: string | string[]
) {
  try {
    // Create the answer
    const surveyAnswer = await db.query(() =>
      db.client.surveyAnswer.create({
        data: {
          responseId,
          questionId,
          answerText: Array.isArray(answer) ? null : answer,
        },
      })
    );

    // If it's a checkbox answer with multiple selections
    if (Array.isArray(answer) && answer.length > 0) {
      const options = await db.query(() =>
        db.client.surveyQuestionOption.findMany({
          where: {
            questionId,
            value: { in: answer },
          },
        })
      );

      if (options.length > 0) {
        await db.query(() =>
          db.client.surveyAnswerOption.createMany({
            data: options.map((option) => ({
              answerId: surveyAnswer.id,
              optionId: option.id,
            })),
          })
        );
      }
    }

    return { data: surveyAnswer, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to save answer" };
  }
}

export async function completeSurveyResponse(responseId: string) {
  try {
    const response = await db.query(() =>
      db.client.surveyResponse.update({
        where: { id: responseId },
        data: {
          completedAt: new Date(),
        },
      })
    );

    // Revalidate the survey page to update results
    revalidatePath("/surveys");

    return { data: response, error: null };
  } catch (_error) {
    return { data: null, error: "Failed to complete response" };
  }
}

// biome-ignore lint/suspicious/noExplicitAny: Dynamic survey data types
function processAnswerResponses(answer: any, questionStats: Map<string, any>) {
  const questionId = answer.questionId;

  if (!questionStats.has(questionId)) {
    questionStats.set(questionId, {
      question: answer.question,
      responses: [],
    });
  }

  const questionData = questionStats.get(questionId);

  if (answer.answerText) {
    questionData.responses.push(answer.answerText);
    return;
  }

  if (answer.selectedOptions.length > 0) {
    for (const selectedOption of answer.selectedOptions) {
      questionData.responses.push(selectedOption.option.value);
    }
  }
}

// biome-ignore lint/suspicious/noExplicitAny: Dynamic survey response types
function buildQuestionStats(responses: any[]) {
  const questionStats = new Map();

  for (const response of responses) {
    for (const answer of response.answers) {
      processAnswerResponses(answer, questionStats);
    }
  }

  return Array.from(questionStats.entries());
}

export async function getSurveyResults(surveyId: string) {
  try {
    const responses = await db.query(() =>
      db.client.surveyResponse.findMany({
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
      })
    );

    const totalResponses = responses.length;
    const questionStats = buildQuestionStats(responses);

    return {
      data: {
        totalResponses,
        responses,
        questionStats,
      },
      error: null,
    };
  } catch (_error) {
    return { data: null, error: "Failed to fetch results" };
  }
}
