export type Poll = {
  id: string;
  title: string;
  description: string | null;
  code: string;
  isActive: boolean;
  allowMultiple: boolean;
  showResults: boolean;
  resultsDelay: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  questions?: PollQuestion[];
};

export type PollQuestion = {
  id: string;
  pollId: string;
  questionOrder: number;
  question: string;
  type: 'single' | 'multiple';
  maxSelections: number | null;
  createdAt: Date;
  options?: PollOption[];
  votes?: PollVote[];
};

export type PollOption = {
  id: string;
  questionId: string;
  optionOrder: number;
  label: string;
  value: string;
  color: string | null;
  createdAt: Date;
  voteCount?: number; // For aggregated results
};

export type PollVote = {
  id: string;
  sessionId: string;
  questionId: string;
  optionId: string;
  createdAt: Date;
};

export type PollSession = {
  id: string;
  pollId: string;
  sessionId: string;
  profileId: string | null;
  userAgent: string | null;
  ipHash: string | null;
  createdAt: Date;
};

export type PollWithQuestions = Poll & {
  questions: (PollQuestion & {
    options: PollOption[];
  })[];
};

export type PollResults = {
  pollId: string;
  totalVotes: number;
  questions: {
    questionId: string;
    question: string;
    type: string;
    totalQuestionVotes: number;
    options: {
      optionId: string;
      label: string;
      value: string;
      color: string | null;
      voteCount: number;
      percentage: number;
    }[];
  }[];
};

export type RealtimeVoteUpdate = {
  type: 'vote_added' | 'vote_removed';
  pollId: string;
  questionId: string;
  optionId: string;
  timestamp: Date;
};
