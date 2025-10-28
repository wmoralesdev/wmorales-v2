"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-800 bg-gray-900/80 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white">
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-400">
              Authentication Failed
            </AlertTitle>
            <AlertDescription className="text-gray-400">
              There was an error during the authentication process. This could
              be due to:
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>The authentication code expired</li>
                <li>The authentication was cancelled</li>
                <li>A network error occurred</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              className="flex-1 border-gray-700 hover:bg-gray-800"
              onClick={() => router.back()}
              variant="outline"
            >
              Go Back
            </Button>
            <Button
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/")}
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
