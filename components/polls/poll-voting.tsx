'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getPollResults, votePoll } from '@/app/actions/poll.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { type PollRealtimeEvent, subscribeToPollUpdates } from '@/lib/supabase/realtime';
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
  const [voting, setVoting] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);

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
  }, [poll.questions, userVotes]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = subscribeToPollUpdates(poll.code, async (event: PollRealtimeEvent) => {
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
    });

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

  const handleVote = useCallback(
    async (questionId: string) => {
      const selected = selectedOptions[questionId];
      if (!selected || (Array.isArray(selected) && selected.length === 0)) return;

      setVoting(questionId);
      try {
        const result = await votePoll(poll.id, questionId, selected);
        if (result.error) {
          // Handle error (show toast, etc.)
        } else {
          // Update user votes
          setUserVotes((prev) => ({
            ...prev,
            [questionId]: Array.isArray(selected) ? selected : [selected],
          }));

          // Fetch fresh results
          const { data } = await getPollResults(poll.id);
          if (data) {
            setResults(data);
          }
        }
      } finally {
        setVoting(null);
      }
    },
    [poll.id, selectedOptions]
  );

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

      {/* Questions */}
      <AnimatePresence mode="wait">
        {poll.questions.map((question, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            key={question.id}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {index + 1}. {question.question}
                </CardTitle>
                {question.type === 'multiple' && question.maxSelections && (
                  <CardDescription>Select up to {question.maxSelections} options</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {question.type === 'single' ? (
                  <RadioGroup
                    disabled={hasVoted(question.id) || voting === question.id}
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
                              disabled={hasVoted(question.id) || voting === question.id}
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

                {!hasVoted(question.id) && (
                  <Button
                    className="w-full"
                    disabled={
                      voting === question.id ||
                      (question.type === 'single' && !selectedOptions[question.id]) ||
                      (question.type === 'multiple' &&
                        (!selectedOptions[question.id] || (selectedOptions[question.id] as string[]).length === 0))
                    }
                    onClick={() => handleVote(question.id)}
                  >
                    {voting === question.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Vote'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
