import { Calendar, Github, Mail, Sparkles, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

type UserTicketProps = {
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
};

export function UserTicket({ user, colors }: UserTicketProps) {
  // Default colors if no custom colors provided
  const ticketColors = colors || {
    primary: 'from-purple-500 to-pink-500',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'purple-400',
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
        <div className="-top-8 -translate-x-1/2 absolute left-1/2 transform">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-transparent to-gray-400" />
        </div>

        {/* Ticket/Badge */}
        <Card className="w-80 overflow-hidden border-0 shadow-2xl sm:w-96">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${ticketColors.primary} relative overflow-hidden p-6 text-white`}>
            <div className="absolute top-0 right-0 h-32 w-32 opacity-20">
              <Sparkles className="h-full w-full" />
            </div>
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <Badge className="border-0 bg-white/20 text-white" variant="secondary">
                  GUEST
                </Badge>
                <Badge className="flex items-center gap-1 border-0 bg-white/20 text-white" variant="secondary">
                  {getProviderIcon(user.provider)}
                  {user.provider.toUpperCase()}
                </Badge>
              </div>

              <div className="text-center">
                <Avatar className="mx-auto mb-3 h-16 w-16 border-4 border-white/30">
                  <AvatarImage alt={user.name} src={user.avatar_url} />
                  <AvatarFallback className="bg-white/20 font-bold text-white text-xl">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-xl">{user.name}</h3>
                <p className="text-sm text-white/80">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-card p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="mb-2 font-semibold text-foreground text-lg">Walter Morales Portfolio</h4>
                <p className="text-muted-foreground text-sm">Digital Guestbook Visitor</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                <span>{currentDate}</span>
              </div>

              <div className="border-muted border-t border-dashed pt-4">
                <div className="text-center">
                  <p className="mb-2 text-muted-foreground text-xs">TICKET ID</p>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-foreground text-xs">
                    {user.id.toUpperCase()}-{Date.now().toString().slice(-6)}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Footer decoration */}
          <div className={`h-2 bg-gradient-to-r ${ticketColors.secondary}`} />
        </Card>

        {/* Shadow/reflection effect */}
        <div className="-bottom-1 absolute right-2 left-2 h-4 rounded-full bg-gradient-to-r from-transparent via-black/10 to-transparent blur-sm" />
      </div>
    </div>
  );
}
