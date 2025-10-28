import { Share2 } from "lucide-react";
import Link from "next/link";
import { UserTicket } from "@/components/guestbook/user-ticket";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TicketData } from "@/lib/types/guestbook.types";

type GuestbookUserTicketProps = {
  userTicket: TicketData;
  onShare: () => void;
};

export function GuestbookUserTicket({
  userTicket,
  onShare,
}: GuestbookUserTicketProps) {
  return (
    <div className="animate-delay-400 animate-fade-in-up">
      <Link className="group block" href={`/guestbook/${userTicket.id}`}>
        <div className="relative">
          <UserTicket
            colors={{
              primary: userTicket.primaryColor,
              secondary: userTicket.secondaryColor,
              accent: userTicket.accentColor,
              background: userTicket.backgroundColor,
            }}
            ticketNumber={userTicket.ticketNumber}
            user={{
              id: userTicket.id,
              name: userTicket.userName,
              email: userTicket.userEmail,
              avatar_url: userTicket.userAvatar || undefined,
              provider: userTicket.userProvider,
            }}
          />
          <div className="absolute inset-0 rounded-2xl bg-white/0 transition-colors group-hover:bg-white/5" />
        </div>
      </Link>
      {userTicket.entry?.mood && (
        <Card className="mx-auto mt-4 max-w-md">
          <CardContent className="">
            <div className="flex items-center justify-between">
              <p className="text-center text-muted-foreground text-sm">
                Current mood: &quot;{userTicket.entry.mood}&quot;
              </p>
              <Button
                className="gap-2"
                onClick={onShare}
                size="sm"
                variant="ghost"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
