'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart3, PieChart, RefreshCw, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePollResultsSWR } from '@/hooks/use-poll-results-swr';
import { usePollPresence } from '@/hooks/use-poll-presence';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type PollRealtimeEvent, type PollPresence, subscribeToPollUpdates } from '@/lib/supabase/realtime';
import type { PollResults } from '@/lib/types/poll.types';
import { cn } from '@/lib/utils';

type PollResultsDashboardProps = {
  pollId: string;
  pollCode: string;
  pollTitle: string;
  initialResults: PollResults;
};

export function PollResultsDashboard({ pollId, pollCode, pollTitle, initialResults }: PollResultsDashboardProps) {
  const { results, refresh } = usePollResultsSWR(pollId, initialResults);
  const [activeUsers, setActiveUsers] = useState<PollPresence[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const channel = subscribeToPollUpdates(
      pollCode,
      async (event: PollRealtimeEvent) => {
        if (event.type === 'results_updated' || event.type === 'vote_added') {
          setIsUpdating(true);
          await refresh();
          setTimeout(() => setIsUpdating(false), 500);
        }
      },
      (users) => {
        setActiveUsers(users);
      }
    );

    return () => {
      channel.unsubscribe();
    };
  }, [pollCode, refresh]);

  const totalVoters = results?.totalVotes || 0;
  const activeUsersCount = activeUsers.length;

  // Broadcast active users count
  usePollPresence(pollCode, activeUsersCount);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalVoters}</div>
            <p className="text-muted-foreground text-xs">Unique voters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="font-bold text-2xl">{activeUsersCount}</div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            </div>
            <p className="text-muted-foreground text-xs">Viewing results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Questions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{results?.questions.length || 0}</div>
            <p className="text-muted-foreground text-xs">Total questions</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Results</CardTitle>
              <CardDescription>Real-time voting results for {pollTitle}</CardDescription>
            </div>
            {isUpdating && (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}>
                <RefreshCw className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs className="w-full" defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed Results</TabsTrigger>
            </TabsList>

            <TabsContent className="mt-6 space-y-6" value="overview">
              {results?.questions.map((question, index) => (
                <div className="space-y-4" key={question.questionId}>
                  <h3 className="font-semibold text-lg">
                    {index + 1}. {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <motion.div
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        key={option.optionId}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {option.emoji && <span className="text-xl">{option.emoji}</span>}
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm">{option.percentage}%</span>
                            <span className="text-muted-foreground text-sm">({option.voteCount} votes)</span>
                          </div>
                        </div>
                        <Progress
                          className="h-3"
                          style={{
                            // @ts-expect-error - CSS variable
                            '--progress-background': option.color || 'hsl(var(--primary))',
                          }}
                          value={option.percentage}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent className="mt-6 space-y-6" value="details">
              {results?.questions.map((question, index) => (
                <Card key={question.questionId}>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Question {index + 1}: {question.question}
                    </CardTitle>
                    <CardDescription>
                      {question.totalQuestionVotes} total responses • {question.type} choice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {question.options
                        .sort((a, b) => b.voteCount - a.voteCount)
                        .map((option, optionIndex) => (
                          <div
                            className={cn(
                              'flex items-center justify-between rounded-lg p-3',
                              optionIndex === 0 && 'bg-primary/5'
                            )}
                            key={option.optionId}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-muted-foreground text-sm">#{optionIndex + 1}</span>
                              {option.emoji && <span className="text-lg">{option.emoji}</span>}
                              <span className={cn('font-medium', optionIndex === 0 && 'text-primary')}>
                                {option.label}
                              </span>
                              {optionIndex === 0 && <PieChart className="h-4 w-4 text-primary" />}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-24">
                                <Progress className="h-2" value={option.percentage} />
                              </div>
                              <span className="w-12 text-right font-medium text-sm">{option.percentage}%</span>
                              <span className="w-16 text-right text-muted-foreground text-sm">
                                ({option.voteCount})
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Active Users */}
      {activeUsersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Active Viewers
            </CardTitle>
            <CardDescription>{activeUsersCount} users viewing results right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {activeUsers.slice(0, 50).map((user) => (
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-xs"
                    exit={{ opacity: 0, scale: 0.8 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    key={user.sessionId}
                    transition={{ duration: 0.2 }}
                  >
                    {user.sessionId.substring(0, 2).toUpperCase()}
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeUsersCount > 50 && (
                <div className="flex h-8 items-center rounded-full bg-muted px-3 text-muted-foreground text-xs">
                  +{activeUsersCount - 50} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
