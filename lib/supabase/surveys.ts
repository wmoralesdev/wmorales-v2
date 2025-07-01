import { createClient } from './client';
import { createClient as createServerClient } from './server';

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SurveySection {
  id: string;
  survey_id: string;
  section_order: number;
  path?: string;
  title: string;
  description: string;
  questions?: SurveyQuestion[];
}

export interface SurveyQuestion {
  id: string;
  section_id: string;
  question_order: number;
  question: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select';
  required: boolean;
  placeholder?: string;
  options?: SurveyQuestionOption[];
}

export interface SurveyQuestionOption {
  id: string;
  question_id: string;
  option_order: number;
  label: string;
  value: string;
  path?: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  user_id?: string;
  session_id?: string;
  started_at: string;
  completed_at?: string;
}

export interface SurveyAnswer {
  id: string;
  response_id: string;
  question_id: string;
  answer_text?: string;
  selected_options?: string[];
}

// Client-side functions
export const surveysClient = {
  async getActiveSurveys() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Survey[];
  },

  async getSurveyWithSections(surveyId: string) {
    const supabase = createClient();
    
    // Get survey
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single();

    if (surveyError) throw surveyError;

    // Get sections with questions and options
    const { data: sections, error: sectionsError } = await supabase
      .from('survey_sections')
      .select(`
        *,
        questions:survey_questions(
          *,
          options:survey_question_options(*)
        )
      `)
      .eq('survey_id', surveyId)
      .order('section_order');

    if (sectionsError) throw sectionsError;

    return {
      ...survey,
      sections: sections.map(section => ({
        ...section,
        questions: section.questions
          .sort((a: any, b: any) => a.question_order - b.question_order)
          .map((q: any) => ({
            ...q,
            options: q.options?.sort((a: any, b: any) => a.option_order - b.option_order)
          }))
      }))
    };
  },

  async createResponse(surveyId: string, userId?: string) {
    const supabase = createClient();
    const sessionId = userId ? null : crypto.randomUUID();

    const { data, error } = await supabase
      .from('survey_responses')
      .insert({
        survey_id: surveyId,
        user_id: userId,
        session_id: sessionId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as SurveyResponse;
  },

  async saveAnswer(responseId: string, questionId: string, answer: string | string[]) {
    const supabase = createClient();

    // Create answer record
    const { data: answerData, error: answerError } = await supabase
      .from('survey_answers')
      .insert({
        response_id: responseId,
        question_id: questionId,
        answer_text: Array.isArray(answer) ? null : answer,
      })
      .select()
      .single();

    if (answerError) throw answerError;

    // If checkbox question with multiple selections
    if (Array.isArray(answer) && answer.length > 0) {
      const { data: options } = await supabase
        .from('survey_question_options')
        .select('id, value')
        .eq('question_id', questionId)
        .in('value', answer);

      if (options && options.length > 0) {
        const optionInserts = options.map(opt => ({
          answer_id: answerData.id,
          option_id: opt.id,
        }));

        await supabase
          .from('survey_answer_options')
          .insert(optionInserts);
      }
    }

    return answerData;
  },

  async completeResponse(responseId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('survey_responses')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', responseId);

    if (error) throw error;
  },

  async getSurveyResults(surveyId: string) {
    const supabase = createClient();
    
    // Get all responses
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .not('completed_at', 'is', null);

    if (responsesError) throw responsesError;

    // Get all answers with options
    const { data: answers, error: answersError } = await supabase
      .from('survey_answers')
      .select(`
        *,
        question:survey_questions(*),
        selected_options:survey_answer_options(
          option:survey_question_options(*)
        )
      `)
      .in('response_id', responses.map(r => r.id));

    if (answersError) throw answersError;

    return {
      total_responses: responses.length,
      responses,
      answers,
    };
  },
};

// Server-side functions
export const surveysServer = {
  async getActiveSurveys() {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Survey[];
  },

  // Add more server-side functions as needed
};