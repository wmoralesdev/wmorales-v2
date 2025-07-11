'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, ChevronRight, Loader2, Users } from 'lucide-react';
import { useCallback, useEffect, useReducer } from 'react';
import { getPollResults, votePoll } from '@/app/actions/poll.actions';
import { PollResultsDashboard } from '@/components/polls/poll-results-dashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type PollPresence, type PollRealtimeEvent, subscribeToPollUpdates } from '@/lib/supabase/realtime';
import type { PollQuestion, PollResults, PollWithQuestions } from '@/lib/types/poll.types';
import { cn } from '@/lib/utils';

type PollVotingProps = {
  poll: PollWithQuestions;
  initialResults?: PollResults;
  initialUserVotes?: Record<string, string[]>;
};

// State type for useReducer
type PollVotingState = {
  selectedOptions: Record<string, string | string[]>;
  userVotes: Record<string, string[]>;
  results: PollResults | null;
  voting: boolean;
  showResults: boolean;
  showDashboard: boolean;
  totalVoters: number;
  activeUsers: PollPresence[];
  validationErrors: string[];
};

// Action types
type PollVotingAction =
  | { type: 'SET_SELECTED_OPTIONS'; payload: Record<string, string | string[]> }
  | { type: 'UPDATE_SELECTED_OPTION'; payload: { questionId: string; value: string | string[] } }
  | { type: 'SET_USER_VOTES'; payload: Record<string, string[]> }
  | { type: 'SET_RESULTS'; payload: PollResults }
  | { type: 'SET_VOTING'; payload: boolean }
  | { type: 'SET_SHOW_RESULTS'; payload: boolean }
  | { type: 'SET_SHOW_DASHBOARD'; payload: boolean }
  | { type: 'SET_TOTAL_VOTERS'; payload: number }
  | { type: 'SET_ACTIVE_USERS'; payload: PollPresence[] }
  | { type: 'SET_VALIDATION_ERRORS'; payload: string[] }
  | { type: 'CLEAR_VALIDATION_ERROR'; payload: number };

// Reducer function
function pollVotingReducer(state: PollVotingState, action: PollVotingAction): PollVotingState {
  switch (action.type) {
    case 'SET_SELECTED_OPTIONS':
      return { ...state, selectedOptions: action.payload };
    case 'UPDATE_SELECTED_OPTION':
      return {
        ...state,
        selectedOptions: {
          ...state.selectedOptions,
          [action.payload.questionId]: action.payload.value,
        },
      };
    case 'SET_USER_VOTES':
      return { ...state, userVotes: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_VOTING':
      return { ...state, voting: action.payload };
    case 'SET_SHOW_RESULTS':
      return { ...state, showResults: action.payload };
    case 'SET_SHOW_DASHBOARD':
      return { ...state, showDashboard: action.payload };
    case 'SET_TOTAL_VOTERS':
      return { ...state, totalVoters: action.payload };
    case 'SET_ACTIVE_USERS':
      return { ...state, activeUsers: action.payload };
    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };
    case 'CLEAR_VALIDATION_ERROR':
      return {
        ...state,
        validationErrors: state.validationErrors.filter((err) => !err.includes(`Question ${action.payload + 1}`)),
      };
    default:
      return state;
  }
}

export function PollVoting({ poll, initialResults, initialUserVotes = {} }: PollVotingProps) {
  const [state, dispatch] = useReducer(pollVotingReducer, {
    selectedOptions: {},
    userVotes: initialUserVotes,
    results: initialResults || null,
    voting: false,
    showResults: false,
    showDashboard: false,
    totalVoters: 0,
    activeUsers: [],
    validationErrors: [],
  });

  const allQuestionsAnswered = poll.questions.every((q) => state.userVotes[q.id]?.length > 0);

  useEffect(() => {
    const initial: Record<string, string | string[]> = {};
    for (const question of poll.questions) {
      const votes = state.userVotes[question.id] || [];
      if (question.type === 'single') {
        initial[question.id] = votes[0] || '';
      } else {
        initial[question.id] = votes;
      }
    }
    dispatch({ type: 'SET_SELECTED_OPTIONS', payload: initial });

    if (allQuestionsAnswered) {
      dispatch({ type: 'SET_SHOW_DASHBOARD', payload: true });
    }
  }, [poll.questions, state.userVotes, allQuestionsAnswered]);

  useEffect(() => {
    const channel = subscribeToPollUpdates(
      poll.code,
      async (event: PollRealtimeEvent) => {
        if (event.type === 'poll_closed') {
          window.location.reload();
        } else {
          const { data } = await getPollResults(poll.id);
          if (data) {
            dispatch({ type: 'SET_RESULTS', payload: data });
            dispatch({ type: 'SET_TOTAL_VOTERS', payload: data.totalVotes });
          }
        }
      },
      (users) => {
        dispatch({ type: 'SET_ACTIVE_USERS', payload: users });
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [poll.code, poll.id]);

  useEffect(() => {
    if (poll.showResults && poll.resultsDelay > 0) {
      const hasVoted = Object.keys(state.userVotes).length > 0;
      if (hasVoted) {
        const timer = setTimeout(() => {
          dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
        }, poll.resultsDelay * 1000);
        return () => clearTimeout(timer);
      }
    } else if (poll.showResults) {
      dispatch({ type: 'SET_SHOW_RESULTS', payload: true });
    }
  }, [poll.showResults, poll.resultsDelay, state.userVotes]);

  const validateQuestion = useCallback(
    (question: PollQuestion, index: number) => {
      const answer = state.selectedOptions[question.id];
      const hasVoted = state.userVotes[question.id]?.length > 0;

      if (hasVoted) {
        return null;
      }

      const questionNumber = index + 1;

      if (question.type === 'single' && !answer) {
        return `Question ${questionNumber} requires an answer`;
      }

      if (question.type === 'multiple') {
        const hasSelection = answer && (answer as string[]).length > 0;
        if (!hasSelection) {
          return `Question ${questionNumber} requires at least one selection`;
        }
      }

      return null;
    },
    [state.selectedOptions, state.userVotes]
  );

  const validateAnswers = useCallback(() => {
    const errors: string[] = [];

    for (let i = 0; i < poll.questions.length; i++) {
      const error = validateQuestion(poll.questions[i], i);
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }, [poll.questions, validateQuestion]);

  const submitVoteForQuestion = useCallback(
    async (question: PollQuestion, selected: string | string[]) => {
      const result = await votePoll(poll.id, question.id, selected);
      if (!result.error) {
        return Array.isArray(selected) ? selected : [selected];
      }
      return null;
    },
    [poll.id]
  );

  const shouldProcessQuestion = useCallback(
    (question: PollQuestion) => {
      const hasAnswered = state.userVotes[question.id]?.length > 0;
      if (hasAnswered) {
        return false;
      }

      const selected = state.selectedOptions[question.id];
      return selected && (Array.isArray(selected) ? selected.length > 0 : true);
    },
    [state.userVotes, state.selectedOptions]
  );

  const createVotePromises = useCallback(() => {
    // biome-ignore lint/suspicious/noExplicitAny: form data is dynamic
    const votePromises: Promise<any>[] = [];

    for (const question of poll.questions) {
      if (shouldProcessQuestion(question)) {
        const selected = state.selectedOptions[question.id];
        votePromises.push(
          submitVoteForQuestion(question, selected).then((votes) => ({
            questionId: question.id,
            votes,
          }))
        );
      }
    }

    return votePromises;
  }, [poll.questions, shouldProcessQuestion, state.selectedOptions, submitVoteForQuestion]);

  const processUnansweredQuestions = useCallback(async () => {
    const newVotes = { ...state.userVotes };
    const votePromises = createVotePromises();

    if (votePromises.length === 0) {
      return newVotes;
    }

    const voteResults = await Promise.all(votePromises);
    for (const result of voteResults) {
      if (result.votes) {
        newVotes[result.questionId] = result.votes;
      }
    }

    return newVotes;
  }, [state.userVotes, createVotePromises]);

  const handleSubmitAll = useCallback(async () => {
    const errors = validateAnswers();
    if (errors.length > 0) {
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
      return;
    }

    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: [] });
    dispatch({ type: 'SET_VOTING', payload: true });

    try {
      const newVotes = await processUnansweredQuestions();
      dispatch({ type: 'SET_USER_VOTES', payload: newVotes });

      const { data } = await getPollResults(poll.id);
      if (data) {
        dispatch({ type: 'SET_RESULTS', payload: data });
      }

      setTimeout(() => dispatch({ type: 'SET_SHOW_DASHBOARD', payload: true }), 500);
    } finally {
      dispatch({ type: 'SET_VOTING', payload: false });
    }
  }, [validateAnswers, processUnansweredQuestions, poll.id]);

  const handleOptionChange = (questionId: string, value: string, checked?: boolean) => {
    const question = poll.questions.find((q) => q.id === questionId);
    if (!question) {
      return;
    }

    if (question.type === 'single') {
      dispatch({
        type: 'UPDATE_SELECTED_OPTION',
        payload: { questionId, value },
      });
    } else {
      const current = (state.selectedOptions[questionId] as string[]) || [];
      const newValue = checked ? [...current, value] : current.filter((v) => v !== value);
      dispatch({
        type: 'UPDATE_SELECTED_OPTION',
        payload: { questionId, value: newValue },
      });
    }

    // Clear validation error for this question
    const questionIndex = poll.questions.findIndex((q) => q.id === questionId);
    dispatch({ type: 'CLEAR_VALIDATION_ERROR', payload: questionIndex });
  };

  const hasVoted = (questionId: string) => {
    return (state.userVotes[questionId] || []).length > 0;
  };

  const getOptionPercentage = (questionId: string, optionId: string) => {
    if (!state.results) {
      return 0;
    }
    const question = state.results.questions.find((q) => q.questionId === questionId);
    const option = question?.options.find((o) => o.optionId === optionId);
    return option?.percentage || 0;
  };

  const getOptionVoteCount = (questionId: string, optionId: string) => {
    if (!state.results) {
      return 0;
    }
    const question = state.results.questions.find((q) => q.questionId === questionId);
    const option = question?.options.find((o) => o.optionId === optionId);
    return option?.voteCount || 0;
  };

  const canShowResults = state.showResults && (poll.showResults || hasVoted(poll.questions[0]?.id));

  // Show dashboard if all questions are answered
  if (state.showDashboard && state.results) {
    return (
      <div className="app-container">
        {/* Success Message */}
        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }}>
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <div className="rounded-full bg-green-500/20 p-2">
                  <Check className="h-5 w-5" />
                </div>
                Thank you for voting!
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your responses have been recorded. View the live results below.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Results Dashboard */}
        <PollResultsDashboard
          initialResults={state.results}
          pollCode={poll.code}
          pollId={poll.id}
          pollTitle={poll.title}
        />
      </div>
    );
  }

  // Count answered questions
  const answeredQuestions = poll.questions.filter((q) => hasVoted(q.id)).length;
  const hasAnyUnansweredQuestions = answeredQuestions < poll.questions.length;

  return (
    <div className="app-container">
      {/* Poll Header */}
      <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} transition={{ duration: 0.5 }}>
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-white">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base text-gray-400">{poll.description}</CardDescription>
            )}
            {canShowResults && state.totalVoters > 0 && (
              <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                <Users className="h-4 w-4" />
                <span>
                  {state.totalVoters} {state.totalVoters === 1 ? 'voter' : 'voters'}
                </span>
              </div>
            )}
          </CardHeader>
        </Card>
      </motion.div>

      {/* Progress Indicator */}
      {poll.questions.length > 1 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  Progress: {answeredQuestions} / {poll.questions.length} questions answered
                </span>
                {allQuestionsAnswered && (
                  <Button
                    className="border-purple-500/30 bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                    onClick={() => dispatch({ type: 'SET_SHOW_DASHBOARD', payload: true })}
                    size="sm"
                    variant="outline"
                  >
                    View Results
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800/50">
                <motion.div
                  animate={{ width: `${(answeredQuestions / poll.questions.length) * 100}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Validation Errors */}
      {state.validationErrors.length > 0 && (
        <Alert className='border-red-500/30 bg-red-500/10 text-red-400'>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-inside list-disc space-y-1">
              {state.validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Questions */}
      <AnimatePresence mode="wait">
        {poll.questions.map((question, index) => {
          const isAnswered = hasVoted(question.id);

          return (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              key={question.id}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn('border-gray-800 bg-gray-900/80 backdrop-blur-xl', isAnswered && 'opacity-75')}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-white">
                      {index + 1}. {question.question}
                    </CardTitle>
                    {isAnswered && (
                      <Badge className="gap-1 border-green-500/30 bg-green-500/20 text-green-400" variant="secondary">
                        <Check className="h-3 w-3" />
                        Answered
                      </Badge>
                    )}
                  </div>
                  {question.type === 'multiple' && question.maxSelections && (
                    <CardDescription className="text-gray-400">
                      Select up to {question.maxSelections} options
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.type === 'single' ? (
                    <RadioGroup
                      disabled={isAnswered}
                      onValueChange={(value) => handleOptionChange(question.id, value)}
                      value={state.selectedOptions[question.id] as string}
                    >
                      {(question.options || []).map((option) => {
                        const percentage = getOptionPercentage(question.id, option.id);
                        const voteCount = getOptionVoteCount(question.id, option.id);
                        const isSelected = state.userVotes[question.id]?.includes(option.id);

                        return (
                          <div className="relative" key={option.id}>
                            <div className='flex items-center space-x-2 rounded-lg border border-transparent p-3 transition-colors hover:border-purple-500/30 hover:bg-purple-500/10'>
                              <RadioGroupItem className="text-purple-400" id={option.id} value={option.id} />
                              <Label
                                className="flex flex-1 cursor-pointer items-center gap-2 text-gray-300"
                                htmlFor={option.id}
                              >
                                {option.emoji && <span className="text-xl">{option.emoji}</span>}
                                <span>{option.label}</span>
                                {isSelected && <Check className="ml-auto h-4 w-4 text-purple-400" />}
                              </Label>
                              {canShowResults && (
                                <span className='font-medium text-gray-400 text-sm'>
                                  {percentage}% ({voteCount})
                                </span>
                              )}
                            </div>
                            {canShowResults && (
                              <div className="-z-10 absolute bottom-0 left-0 h-full overflow-hidden rounded-lg">
                                <motion.div
                                  animate={{ width: `${percentage}%` }}
                                  className={cn(
                                    'h-full',
                                    option.color || 'bg-gradient-to-r from-purple-500/20 to-purple-600/20'
                                  )}
                                  initial={{ width: 0 }}
                                  transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {(question.options || []).map((option) => {
                        const percentage = getOptionPercentage(question.id, option.id);
                        const voteCount = getOptionVoteCount(question.id, option.id);
                        const isSelected = state.userVotes[question.id]?.includes(option.id);
                        const isChecked = ((state.selectedOptions[question.id] as string[]) || []).includes(option.id);

                        return (
                          <div className="relative" key={option.id}>
                            <div className="flex items-center space-x-2 rounded-lg p-3 transition-colors hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30">
                              <Checkbox
                                checked={isChecked}
                                disabled={isAnswered}
                                id={option.id}
                                onCheckedChange={(checked) =>
                                  handleOptionChange(question.id, option.id, checked as boolean)
                                }
                                className="text-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                              />
                              <Label className="flex flex-1 cursor-pointer items-center gap-2 text-gray-300" htmlFor={option.id}>
                                {option.emoji && <span className="text-xl">{option.emoji}</span>}
                                <span>{option.label}</span>
                                {isSelected && <Check className="ml-auto h-4 w-4 text-purple-400" />}
                              </Label>
                              {canShowResults && (
                                <span className="font-medium text-sm text-gray-400">
                                  {percentage}% ({voteCount})
                                </span>
                              )}
                            </div>
                            {canShowResults && (
                              <div className="-z-10 absolute bottom-0 left-0 h-full overflow-hidden rounded-lg">
                                <motion.div
                                  animate={{ width: `${percentage}%` }}
                                  className={cn('h-full', option.color || 'bg-gradient-to-r from-purple-500/20 to-purple-600/20')}
                                  initial={{ width: 0 }}
                                  transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Single Submit Button */}
      {hasAnyUnansweredQuestions && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className='border-gray-800 bg-gray-900/80 backdrop-blur-xl'>
            <CardContent className="pt-6">
              <Button
                className='w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/25'
                disabled={state.voting}
                onClick={handleSubmitAll}
                size="lg"
              >
                {state.voting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Answers...
                  </>
                ) : (
                  <>
                    Submit All Answers
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="mt-2 text-center text-gray-500 text-sm">
                Make sure to answer all questions before submitting
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
