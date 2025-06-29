import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Mail, LogIn } from "lucide-react";

interface SignInCardProps {
  onSignIn: (provider: 'github' | 'google') => void;
}

export function SignInCard({ onSignIn }: SignInCardProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
            <LogIn className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <CardTitle className="text-2xl">Sign in to continue</CardTitle>
        <p className="text-muted-foreground">
          Choose your preferred method to sign in and create your personalized ticket
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => onSignIn('github')}
          variant="outline"
          className="w-full h-12 text-base border-2 hover:border-purple-400 hover:bg-purple-50/10 transition-all duration-200"
        >
          <Github className="h-5 w-5 mr-3" />
          Continue with GitHub
        </Button>

        <Button
          onClick={() => onSignIn('google')}
          variant="outline"
          className="w-full h-12 text-base border-2 hover:border-purple-400 hover:bg-purple-50/10 transition-all duration-200"
        >
          <Mail className="h-5 w-5 mr-3" />
          Continue with Google
        </Button>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to create a personalized ticket and optionally leave a message
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 