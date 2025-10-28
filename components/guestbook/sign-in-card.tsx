import { Github, LogIn, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SignInCardProps = {
  onSignIn: (provider: "github" | "google") => void;
};

export function SignInCard({ onSignIn }: SignInCardProps) {
  const t = useTranslations("guestbook");
  const tAuth = useTranslations("auth");

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-3">
            <LogIn className="h-8 w-8 text-purple-400" />
          </div>
        </div>
        <CardTitle className="text-2xl">{t("signInTitle")}</CardTitle>
        <p className="text-muted-foreground">{t("signInDescription")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="h-12 w-full border-2 text-base transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/10"
          onClick={() => onSignIn("github")}
          variant="outline"
        >
          <Github className="mr-3 h-5 w-5" />
          {tAuth("continueWith", { provider: "GitHub" })}
        </Button>

        <Button
          className="h-12 w-full border-2 text-base transition-all duration-200 hover:border-purple-400 hover:bg-purple-50/10"
          onClick={() => onSignIn("google")}
          variant="outline"
        >
          <Mail className="mr-3 h-5 w-5" />
          {tAuth("continueWith", { provider: "Google" })}
        </Button>

        <div className="pt-4 text-center">
          <p className="text-muted-foreground text-xs">{t("termsText")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
