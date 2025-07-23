'use client';

import { motion, type Variants } from 'framer-motion';
import { BarChart3, Check, Copy, ExternalLink, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { subscribeToPollsList } from '@/lib/supabase/realtime';

type Poll = {
  id: string;
  title: string;
  description: string | null;
  code: string;
  isActive: boolean;
  createdAt: Date;
  _count: {
    sessions: number;
    questions: number;
  };
};

type PollsListProps = {
  polls: Poll[];
};

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

export function PollsList({ polls }: PollsListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<Record<string, number>>({});

  // Subscribe to active users updates
  useEffect(() => {
    const channel = subscribeToPollsList((pollActiveUsers) => {
      setActiveUsers((prev) => ({ ...prev, ...pollActiveUsers }));
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/polls/${code}`);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (_err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/polls/${code}`;
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (_copyErr) {
        // Copy failed
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <motion.div
      animate="visible"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      variants={containerVariants}
    >
      {polls.map((poll) => {
        const currentActiveUsers = activeUsers[poll.code] || 0;

        return (
          <motion.div key={poll.id} variants={cardVariants} whileHover="hover">
            <Card className="h-full cursor-pointer border-gray-800 bg-gray-900/80 backdrop-blur-xl transition-all hover:border-purple-500/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="line-clamp-1 text-white">{poll.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-gray-400">
                      {poll.description || 'Help us decide our next feature by voting on your favorite option!'}
                    </CardDescription>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <Badge
                      className={
                        poll.isActive
                          ? 'border-green-500/30 bg-green-500/20 text-green-400'
                          : 'border-gray-500/30 bg-gray-500/20 text-gray-400'
                      }
                      variant={poll.isActive ? 'default' : 'secondary'}
                    >
                      {poll.isActive ? 'Active' : 'Closed'}
                    </Badge>
                    {currentActiveUsers > 0 && poll.isActive && (
                      <Badge className="gap-1 border-green-500/30 bg-green-500/10 text-green-400" variant="outline">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                        {currentActiveUsers} live
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{poll._count.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{poll._count.sessions} total</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-gray-800/50 px-2 py-1 font-mono text-gray-300 text-xs backdrop-blur">
                      {poll.code}
                    </code>
                    <Button
                      className="h-8 w-8 p-0 text-gray-400 hover:bg-purple-500/20 hover:text-purple-400"
                      onClick={() => copyToClipboard(poll.code)}
                      variant="ghost"
                    >
                      {copiedCode === poll.code ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="h-9 flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white transition-all duration-300 hover:from-purple-600 hover:to-purple-700"
                    >
                      <Link href={`/polls/${poll.code}`}>
                        View Poll
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="text-gray-500 text-xs">Created {new Date(poll.createdAt).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
