"use client";

import type { RealtimeChannel } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, BarChart3, PieChart, RefreshCw, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePollResultsSWR } from "@/hooks/use-poll-results-swr";
import {
  type PollPresence,
  type PollRealtimeEvent,
  subscribeToPollUpdates,
} from "@/lib/supabase/realtime";
import type { PollResults } from "@/lib/types/poll.types";
import { cn } from "@/lib/utils";

// Constants
const DEBOUNCE_DELAY_MS = 500;
const UPDATE_TIMEOUT_MS = 500;
const ANIMATION_DELAY_INCREMENT = 0.1;
const ANIMATION_BASE_DELAY = 0.2;
const MAX_VISIBLE_USERS = 20;
const ANIMATION_DURATION_SHORT = 0.2;

type PollResultsDashboardProps = {
  pollId: string;
  pollCode: string;
  pollTitle: string;
  initialResults: PollResults;
};

function getInitials(name?: string): string {
  if (!name) {
    return "UN";
  }

  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function PollResultsDashboard({
  pollId,
  pollCode,
  pollTitle,
  initialResults,
}: PollResultsDashboardProps) {
  const { results, refresh } = usePollResultsSWR(pollId, initialResults);
  const [activeUsers, setActiveUsers] = useState<PollPresence[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(true);
  const refreshRef = useRef(refresh);

  // Debounce active users updates to prevent excessive re-renders with many users
  const debouncedActiveUsers = useDebounce(activeUsers, DEBOUNCE_DELAY_MS);

  // Keep refresh ref current
  refreshRef.current = refresh;

  useEffect(() => {
    isMountedRef.current = true;

    // Clean up any existing channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
    }

    const channel = subscribeToPollUpdates(
      pollCode,
      async (event: PollRealtimeEvent) => {
        if (event.type === "results_updated" || event.type === "vote_added") {
          setIsUpdating(true);
          await refreshRef.current();
          setTimeout(() => setIsUpdating(false), UPDATE_TIMEOUT_MS);
        }
      },
      (users) => {
        if (isMountedRef.current) {
          setActiveUsers(users);
        }
      }
    );

    channelRef.current = channel;

    return () => {
      isMountedRef.current = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [pollCode]);

  const totalVoters = results?.totalVotes || 0;
  const activeUsersCount = debouncedActiveUsers.length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-gray-300 text-sm">
                Total Participants
              </CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-white">{totalVoters}</div>
              <p className="text-gray-500 text-xs">Unique voters</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-gray-300 text-sm">
                Active Now
              </CardTitle>
              <Activity className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="font-bold text-2xl text-white">
                  {activeUsersCount}
                </div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              </div>
              <p className="text-gray-500 text-xs">Viewing results</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-gray-300 text-sm">
                Questions
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl text-white">
                {results?.questions.length || 0}
              </div>
              <p className="text-gray-500 text-xs">Total questions</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Results Tabs */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Live Results</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time voting results for {pollTitle}
                </CardDescription>
              </div>
              {isUpdating && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <RefreshCw className="h-4 w-4 text-purple-400" />
                </motion.div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs className="w-full" defaultValue="overview">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 backdrop-blur">
                <TabsTrigger
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                  value="overview"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
                  value="details"
                >
                  Detailed Results
                </TabsTrigger>
              </TabsList>

              <TabsContent className="mt-6 space-y-6" value="overview">
                {results?.questions.map((question: any, index: number) => (
                  <div className="space-y-4" key={question.questionId}>
                    <h3 className="font-semibold text-lg text-white">
                      {index + 1}. {question.question}
                    </h3>
                    <div className="space-y-3">
                      {question.options.map((option: any) => (
                        <motion.div
                          animate={{ opacity: 1, x: 0 }}
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          key={option.optionId}
                          transition={{
                            delay: index * ANIMATION_DELAY_INCREMENT + ANIMATION_BASE_DELAY,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {option.emoji && (
                                <span className="text-xl">{option.emoji}</span>
                              )}
                              <span className="font-medium text-gray-300">
                                {option.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-sm text-white">
                                {option.percentage}%
                              </span>
                              <span className="text-gray-500 text-sm">
                                ({option.voteCount} votes)
                              </span>
                            </div>
                          </div>
                          <div className="relative h-3 overflow-hidden rounded-full bg-gray-800/50">
                            <motion.div
                              animate={{ width: `${option.percentage}%` }}
                              className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                              initial={{ width: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent className="mt-6 space-y-6" value="details">
                {results?.questions.map((question: any, index: number) => (
                  <Card
                    className="border-gray-700 bg-gray-800/50 backdrop-blur"
                    key={question.questionId}
                  >
                    <CardHeader>
                      <CardTitle className="text-base text-white">
                        Question {index + 1}: {question.question}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {question.totalQuestionVotes} total responses •{" "}
                        {question.type} choice
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {question.options
                          .sort((a: any, b: any) => b.voteCount - a.voteCount)
                          .map((option: any, optionIndex: number) => (
                            <div
                              className={cn(
                                "flex items-center justify-between rounded-lg border border-transparent p-3",
                                optionIndex === 0 &&
                                  "border-purple-500/30 bg-purple-500/10"
                              )}
                              key={option.optionId}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-500 text-sm">
                                  #{optionIndex + 1}
                                </span>
                                {option.emoji && (
                                  <span className="text-lg">
                                    {option.emoji}
                                  </span>
                                )}
                                <span
                                  className={cn(
                                    "font-medium",
                                    optionIndex === 0
                                      ? "text-purple-300"
                                      : "text-gray-300"
                                  )}
                                >
                                  {option.label}
                                </span>
                                {optionIndex === 0 && (
                                  <PieChart className="h-4 w-4 text-purple-400" />
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="w-24">
                                  <div className="relative h-2 overflow-hidden rounded-full bg-gray-700">
                                    <motion.div
                                      animate={{
                                        width: `${option.percentage}%`,
                                      }}
                                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                                      initial={{ width: 0 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                </div>
                                <span className="w-12 text-right font-medium text-sm text-white">
                                  {option.percentage}%
                                </span>
                                <span className="w-16 text-right text-gray-500 text-sm">
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
      </motion.div>

      {/* Active Users */}
      {activeUsersCount > 0 && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-gray-800 bg-gray-900/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-green-400" />
                Active Viewers
              </CardTitle>
              <CardDescription className="text-gray-400">
                {activeUsersCount} users viewing results right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {debouncedActiveUsers.slice(0, MAX_VISIBLE_USERS).map((user) => (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      key={user.sessionId}
                      transition={{ duration: ANIMATION_DURATION_SHORT }}
                    >
                      <Avatar className="h-8 w-8 border border-gray-700">
                        <AvatarImage
                          alt={user.userName || "User"}
                          src={user.userAvatar}
                        />
                        <AvatarFallback className="bg-purple-500/20 text-purple-300 text-xs">
                          {getInitials(user.userName)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {activeUsersCount > MAX_VISIBLE_USERS && (
                  <div className="flex h-8 items-center rounded-full bg-gray-800/50 px-3 text-gray-400 text-xs">
                    +{activeUsersCount - MAX_VISIBLE_USERS} more
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
