"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Github, Mail, Palette, Sparkles, User } from "lucide-react";
import { SignInCard } from "@/components/sign-in-card";
import { UserTicket } from "@/components/user-ticket";

export function GuestbookContent() {
  // Mock authentication state - replace with actual Supabase auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [isGeneratingColors, setIsGeneratingColors] = useState(false);

  // Mock user data - replace with actual auth user
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar_url: "https://github.com/shadcn.png",
    provider: "github"
  };

  const handleSignIn = (provider: 'github' | 'google') => {
    // Mock sign in - replace with Supabase auth
    console.log(`Signing in with ${provider}`);
    setIsAuthenticated(true);
    setUser(mockUser);
  };

  const handleGenerateColors = async () => {
    if (!customMessage.trim()) return;

    setIsGeneratingColors(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingColors(false);

    // Mock response - integrate with actual AI later
    console.log("Generated colors based on:", customMessage);
  };

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in-up animate-delay-400">
        <SignInCard onSignIn={handleSignIn} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Ticket */}
      <div className="animate-fade-in-up animate-delay-400">
        <UserTicket user={user} />
      </div>

      {/* AI Color Customization */}
      <div className="animate-fade-in-up animate-delay-600">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customize Your Ticket Colors
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Describe your mood, style, or anything that inspires you. Our AI will generate a unique color palette for your ticket.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Tell the AI about your style... (e.g., 'I love sunset colors and ocean vibes' or 'Make it dark and mysterious like a cyberpunk city')"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-24 resize-none"
            />
            <Button
              onClick={handleGenerateColors}
              disabled={!customMessage.trim() || isGeneratingColors}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGeneratingColors ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating Colors...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Colors
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Messages Section - Placeholder for future messages */}
      <div className="animate-fade-in-up animate-delay-800">
        <Card>
          <CardHeader>
            <CardTitle>Recent Signatures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Messages from other visitors will appear here...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 