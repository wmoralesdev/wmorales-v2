import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Mail, Calendar, User, Sparkles } from "lucide-react";

interface UserTicketProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    provider: string;
  };
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function UserTicket({ user, colors }: UserTicketProps) {
  // Default colors if no custom colors provided
  const ticketColors = colors || {
    primary: "from-purple-500 to-pink-500",
    secondary: "from-purple-600 to-pink-600",
    accent: "purple-400"
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'google':
        return <Mail className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Lanyard String */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
          <div className="w-1 h-8 bg-gradient-to-b from-transparent to-gray-400 rounded-full"></div>
        </div>

        {/* Ticket/Badge */}
        <Card className="w-80 sm:w-96 overflow-hidden border-0 shadow-2xl">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${ticketColors.primary} p-6 text-white relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              <Sparkles className="h-full w-full" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  GUEST
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 flex items-center gap-1">
                  {getProviderIcon(user.provider)}
                  {user.provider.toUpperCase()}
                </Badge>
              </div>

              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3 border-4 border-white/30">
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-white/80 text-sm">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 bg-card">
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  Walter Morales Portfolio
                </h4>
                <p className="text-sm text-muted-foreground">
                  Digital Guestbook Visitor
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{currentDate}</span>
              </div>

              <div className="border-t border-dashed border-muted pt-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">
                    TICKET ID
                  </p>
                  <code className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded">
                    {user.id.toUpperCase()}-{Date.now().toString().slice(-6)}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Footer decoration */}
          <div className={`h-2 bg-gradient-to-r ${ticketColors.secondary}`}></div>
        </Card>

        {/* Shadow/reflection effect */}
        <div className="absolute -bottom-1 left-2 right-2 h-4 bg-gradient-to-r from-transparent via-black/10 to-transparent blur-sm rounded-full"></div>
      </div>
    </div>
  );
} 