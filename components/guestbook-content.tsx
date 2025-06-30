'use client';

import { Palette, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { SignInCard } from '@/components/sign-in-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { UserTicket } from '@/components/user-ticket';

export function GuestbookContent() {
  // Mock authentication state - replace with actual Supabase auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);

  // Mock user data - replace with actual auth user
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar_url: 'https://github.com/shadcn.png',
    provider: 'github',
  };

  const handleSignIn = (_provider: 'github' | 'google') => {
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const handleGenerateColors = async () => {
    if (!customMessage.trim()) {
      return;
    }

    setIsGeneratingColors(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGeneratingColors(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="animate-delay-400 animate-fade-in-up">
        <SignInCard onSignIn={handleSignIn} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Ticket */}
      <div className="animate-delay-400 animate-fade-in-up">
        <UserTicket user={user} />
      </div>

      {/* AI Color Customization */}
      <div className="animate-delay-600 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customize Your Ticket Colors
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Describe your mood, style, or anything that inspires you. Our AI will generate a unique color palette for
              your ticket.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              className="min-h-24 resize-none"
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Tell the AI about your style... (e.g., 'I love sunset colors and ocean vibes' or 'Make it dark and mysterious like a cyberpunk city')"
              value={customMessage}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 sm:w-auto"
              disabled={!customMessage.trim() || isGeneratingColors}
              onClick={handleGenerateColors}
            >
              {isGeneratingColors ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Generating Colors...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Colors
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Messages Section - Placeholder for future messages */}
      <div className="animate-delay-800 animate-fade-in-up">
        <Card>
          <CardHeader>
            <CardTitle>Recent Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="py-8 text-center text-muted-foreground">Messages from other visitors will appear here...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
