'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, ChevronRight, Loader2, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getPollResults, votePoll } from '@/app/actions/poll.actions';
import { PollResultsDashboard } from '@/components/polls/poll-results-dashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePollPresence } from '@/hooks/use-poll-presence';
import { type PollPresence, type PollRealtimeEvent, subscribeToPollUpdates } from '@/lib/supabase/realtime';
import type { PollResults, PollWithQuestions } from '@/lib/types/poll.types';
import { cn } from '@/lib/utils';

type PollVotingProps = {
  poll: PollWithQuestions;
  initialResults?: PollResults;
  initialUserVotes?: Record<string, string[]>;
};

export function PollVoting({ poll, initialResults, initialUserVotes = {} }: PollVotingProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>({});
  const [userVotes, setUserVotes] = useState<Record<string, string[]>>(initialUserVotes);
  const [results, setResults] = useState<PollResults | null>(initialResults || null);
  const [voting, setVoting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);
  const [activeUsers, setActiveUsers] = useState<PollPresence[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Check if all questions have been answered
  const allQuestionsAnswered = poll.questions.every((q) => userVotes[q.id]?.length > 0);

  // Initialize selected options from user votes
  useEffect(() => {
    const initial: Record<string, string | string[]> = {};
    for (const question of poll.questions) {
      const votes = userVotes[question.id] || [];
      if (question.type === 'single') {
        initial[question.id] = votes[0] || '';
      } else {
        initial[question.id] = votes;
      }
    }
    setSelectedOptions(initial);

    // Show dashboard if all questions are answered
    if (allQuestionsAnswered) {
      setShowDashboard(true);
    }
  }, [poll.questions, userVotes, allQuestionsAnswered]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = subscribeToPollUpdates(
      poll.code,
      async (event: PollRealtimeEvent) => {
        if (event.type === 'poll_closed') {
          // Refresh the page if poll is closed
          window.location.reload();
        } else {
          // Fetch fresh results
          const { data } = await getPollResults(poll.id);
          if (data) {
            setResults(data);
            setTotalVoters(data.totalVotes);
          }
        }
      },
      (users) => {
        setActiveUsers(users);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [poll.code, poll.id]);

  // Show results after delay
  useEffect(() => {
    if (poll.showResults && poll.resultsDelay > 0) {
      const hasVoted = Object.keys(userVotes).length > 0;
      if (hasVoted) {
        const timer = setTimeout(() => {
          setShowResults(true);
        }, poll.resultsDelay * 1000);
        return () => clearTimeout(timer);
      }
    } else if (poll.showResults) {
      setShowResults(true);
    }
  }, [poll.showResults, poll.resultsDelay, userVotes]);

  const validateAnswers = () => {
    const errors: string[] = [];

    for (const question of poll.questions) {
      const answer = selectedOptions[question.id];
      const hasVoted = userVotes[question.id]?.length > 0;

      if (!hasVoted) {
        if (question.type === 'single' && !answer) {
          errors.push(`Question ${poll.questions.indexOf(question) + 1} requires an answer`);
        } else if (question.type === 'multiple' && (!answer || (answer as string[]).length === 0)) {
          errors.push(`Question ${poll.questions.indexOf(question) + 1} requires at least one selection`);
        }
      }
    }

    return errors;
  };

  const handleSubmitAll = useCallback(async () => {
    // Validate all unanswered questions
    const errors = validateAnswers();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setVoting(true);

    try {
      // Submit votes for all unanswered questions
      const newVotes = { ...userVotes };

      for (const question of poll.questions) {
        if (!userVotes[question.id] || userVotes[question.id].length === 0) {
          const selected = selectedOptions[question.id];
          if (selected && (Array.isArray(selected) ? selected.length > 0 : true)) {
            const result = await votePoll(poll.id, question.id, selected);
            if (!result.error) {
              newVotes[question.id] = Array.isArray(selected) ? selected : [selected];
            }
          }
        }
      }

      setUserVotes(newVotes);

      // Fetch fresh results
      const { data } = await getPollResults(poll.id);
      if (data) {
        setResults(data);
      }

      // Show dashboard
      setTimeout(() => setShowDashboard(true), 500);
    } finally {
      setVoting(false);
    }
  }, [poll, selectedOptions, userVotes]);

  const handleOptionChange = (questionId: string, value: string, checked?: boolean) => {
    const question = poll.questions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.type === 'single') {
      setSelectedOptions((prev) => ({ ...prev, [questionId]: value }));
    } else {
      setSelectedOptions((prev) => {
        const current = (prev[questionId] as string[]) || [];
        if (checked) {
          return { ...prev, [questionId]: [...current, value] };
        }
        return { ...prev, [questionId]: current.filter((v) => v !== value) };
      });
    }

    // Clear validation error for this question
    setValidationErrors((prev) =>
      prev.filter((err) => !err.includes(`Question ${poll.questions.findIndex((q) => q.id === questionId) + 1}`))
    );
  };

  const hasVoted = (questionId: string) => {
    return (userVotes[questionId] || []).length > 0;
  };

  const getOptionPercentage = (questionId: string, optionId: string) => {
    if (!results) return 0;
    const question = results.questions.find((q) => q.questionId === questionId);
    const option = question?.options.find((o) => o.optionId === optionId);
    return option?.percentage || 0;
  };

  const getOptionVoteCount = (questionId: string, optionId: string) => {
    if (!results) return 0;
    const question = results.questions.find((q) => q.questionId === questionId);
    const option = question?.options.find((o) => o.optionId === optionId);
    return option?.voteCount || 0;
  };

  const canShowResults = showResults && (poll.showResults || hasVoted(poll.questions[0]?.id));

  // Broadcast active users count
  usePollPresence(poll.code, showDashboard ? 0 : activeUsers.length);

  // Show dashboard if all questions are answered
  if (showDashboard && results) {
    return (
      <div className="space-y-6">
        {/* Success Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              Thank you for voting!
            </CardTitle>
            <CardDescription>Your responses have been recorded. View the live results below.</CardDescription>
          </CardHeader>
        </Card>

        {/* Results Dashboard */}
        <PollResultsDashboard initialResults={results} pollCode={poll.code} pollId={poll.id} pollTitle={poll.title} />
      </div>
    );
  }

  // Count answered questions
  const answeredQuestions = poll.questions.filter((q) => hasVoted(q.id)).length;
  const hasAnyUnansweredQuestions = answeredQuestions < poll.questions.length;

  return (
    <div className="space-y-6">
      {/* Poll Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          {poll.description && <CardDescription className="text-base">{poll.description}</CardDescription>}
          {canShowResults && totalVoters > 0 && (
            <div className="mt-2 flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="h-4 w-4" />
              <span>
                {totalVoters} {totalVoters === 1 ? 'voter' : 'voters'}
              </span>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      {poll.questions.length > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Progress: {answeredQuestions} / {poll.questions.length} questions answered
              </span>
              {allQuestionsAnswered && (
                <Button onClick={() => setShowDashboard(true)} size="sm" variant="outline">
                  View Results
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                animate={{ width: `${(answeredQuestions / poll.questions.length) * 100}%` }}
                className="h-full bg-primary"
                initial={{ width: 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-inside list-disc space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
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
              <Card className={cn(isAnswered && 'opacity-75')}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {index + 1}. {question.question}
                    </CardTitle>
                    {isAnswered && (
                      <Badge className="gap-1" variant="secondary">
                        <Check className="h-3 w-3" />
                        Answered
                      </Badge>
                    )}
                  </div>
                  {question.type === 'multiple' && question.maxSelections && (
                    <CardDescription>Select up to {question.maxSelections} options</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.type === 'single' ? (
                    <RadioGroup
                      disabled={isAnswered}
                      onValueChange={(value) => handleOptionChange(question.id, value)}
                      value={selectedOptions[question.id] as string}
                    >
                      {(question.options || []).map((option) => {
                        const percentage = getOptionPercentage(question.id, option.id);
                        const voteCount = getOptionVoteCount(question.id, option.id);
                        const isSelected = userVotes[question.id]?.includes(option.id);

                        return (
                          <div className="relative" key={option.id}>
                            <div className="flex items-center space-x-2 rounded-lg p-3 transition-colors hover:bg-accent/50">
                              <RadioGroupItem id={option.id} value={option.id} />
                              <Label className="flex flex-1 cursor-pointer items-center gap-2" htmlFor={option.id}>
                                {option.emoji && <span className="text-xl">{option.emoji}</span>}
                                <span>{option.label}</span>
                                {isSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
                              </Label>
                              {canShowResults && (
                                <span className="font-medium text-sm">
                                  {percentage}% ({voteCount})
                                </span>
                              )}
                            </div>
                            {canShowResults && (
                              <div className="-z-10 absolute bottom-0 left-0 h-full overflow-hidden rounded-lg">
                                <motion.div
                                  animate={{ width: `${percentage}%` }}
                                  className={cn('h-full', option.color || 'bg-primary/10')}
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
                        const isSelected = userVotes[question.id]?.includes(option.id);
                        const isChecked = ((selectedOptions[question.id] as string[]) || []).includes(option.id);

                        return (
                          <div className="relative" key={option.id}>
                            <div className="flex items-center space-x-2 rounded-lg p-3 transition-colors hover:bg-accent/50">
                              <Checkbox
                                checked={isChecked}
                                disabled={isAnswered}
                                id={option.id}
                                onCheckedChange={(checked) =>
                                  handleOptionChange(question.id, option.id, checked as boolean)
                                }
                              />
                              <Label className="flex flex-1 cursor-pointer items-center gap-2" htmlFor={option.id}>
                                {option.emoji && <span className="text-xl">{option.emoji}</span>}
                                <span>{option.label}</span>
                                {isSelected && <Check className="ml-auto h-4 w-4 text-primary" />}
                              </Label>
                              {canShowResults && (
                                <span className="font-medium text-sm">
                                  {percentage}% ({voteCount})
                                </span>
                              )}
                            </div>
                            {canShowResults && (
                              <div className="-z-10 absolute bottom-0 left-0 h-full overflow-hidden rounded-lg">
                                <motion.div
                                  animate={{ width: `${percentage}%` }}
                                  className={cn('h-full', option.color || 'bg-primary/10')}
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
        <Card>
          <CardContent className="pt-6">
            <Button className="w-full" disabled={voting} onClick={handleSubmitAll} size="lg">
              {voting ? (
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
            <p className="mt-2 text-center text-muted-foreground text-sm">
              Make sure to answer all questions before submitting
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
