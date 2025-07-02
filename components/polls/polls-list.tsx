'use client';

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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {polls.map((poll) => {
        const currentActiveUsers = activeUsers[poll.code] || 0;

        return (
          <Card className="transition-all hover:shadow-lg" key={poll.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-1">{poll.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{poll.description || 'No description'}</CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={poll.isActive ? 'default' : 'secondary'}>{poll.isActive ? 'Active' : 'Closed'}</Badge>
                  {currentActiveUsers > 0 && poll.isActive && (
                    <Badge className="gap-1 border-green-600 text-green-600" variant="outline">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
                      {currentActiveUsers} live
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
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
                  <code className="flex-1 rounded bg-muted px-2 py-1 text-xs">{poll.code}</code>
                  <Button className="h-8 w-8 p-0" onClick={() => copyToClipboard(poll.code)} variant="ghost">
                    {copiedCode === poll.code ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="h-9 flex-1">
                    <Link href={`/polls/${poll.code}`}>
                      View Poll
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="text-muted-foreground text-xs">
                Created {new Date(poll.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
