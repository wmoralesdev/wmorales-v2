import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export function GuestbookLoading() {
  const t = useTranslations("guestbook");

  return (
    <div className="animate-fade-in-up space-y-8">
      <Card className="mx-auto max-w-md">
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Sparkles className="h-8 w-8 animate-pulse text-purple-400" />
          </div>
          <p className="mt-4 text-center text-muted-foreground">
            {t("loadingGuestbook")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
