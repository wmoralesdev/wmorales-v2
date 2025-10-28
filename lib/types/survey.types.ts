export type Survey = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  sections?: SurveySection[];
};

export type SurveySection = {
  id: string;
  surveyId: string;
  sectionOrder: number;
  path?: string | null;
  title: string;
  description: string | null;
  questions?: SurveyQuestion[];
};

export type SurveyQuestion = {
  id: string;
  sectionId: string;
  questionOrder: number;
  question: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  required: boolean;
  placeholder?: string | null;
  options?: SurveyQuestionOption[];
};

export type SurveyQuestionOption = {
  id: string;
  questionId: string;
  optionOrder: number;
  label: string;
  value: string;
  path?: string | null;
};

export type SurveyResponse = {
  id: string;
  surveyId: string;
  profileId?: string | null;
  sessionId?: string | null;
  startedAt: Date;
  completedAt?: Date | null;
};

export type SurveyAnswer = {
  id: string;
  responseId: string;
  questionId: string;
  answerText?: string | null;
  selectedOptions?: string[];
};

export type Question = {
  id: string;
  question: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  required?: boolean;
  placeholder?: string;
  options?: Option[];
};

export type Option = {
  label: string;
  value: string;
  path?: string;
};

export type Section = {
  id: string;
  path?: string;
  title: string;
  description: string;
  questions: Question[];
};

export type SurveySectionWithQuestions = SurveySection & {
  questions: (SurveyQuestion & {
    options: SurveyQuestionOption[];
  })[];
};

export type SurveyWithSections = Survey & {
  sections: SurveySectionWithQuestions[];
};
