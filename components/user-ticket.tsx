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
    background?: string;
  };
  ticketNumber?: string;
  scale?: 'normal' | 'small';
};

export function UserTicket({ user, colors, ticketNumber, scale = 'normal' }: UserTicketProps) {
  // Use inline styles for dynamic colors
  const hasCustomColors = !!colors;
  const ticketColors = {
    primary: hasCustomColors ? colors.primary : '#8b5cf6',
    secondary: hasCustomColors ? colors.secondary : '#ec4899',
    accent: hasCustomColors ? colors.accent : '#a78bfa',
    background: hasCustomColors ? colors.background || '#1f1f23' : '#1f1f23',
  };

  const gradientStyle = hasCustomColors
    ? { background: `linear-gradient(to right, ${ticketColors.primary}, ${ticketColors.secondary})` }
    : undefined;

  const footerGradientStyle = hasCustomColors
    ? { background: `linear-gradient(to right, ${ticketColors.secondary}, ${ticketColors.accent})` }
    : undefined;

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

  const isSmall = scale === 'small';

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Lanyard String */}
        {!isSmall && (
          <div className="-top-8 -translate-x-1/2 absolute left-1/2 transform">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-transparent to-gray-400" />
          </div>
        )}

        {/* Ticket/Badge */}
        <Card className={`overflow-hidden border-0 shadow-2xl ${isSmall ? 'w-64' : 'w-80 sm:w-96'}`}>
          {/* Header with gradient */}
          <div 
            className={`relative overflow-hidden ${isSmall ? 'p-4' : 'p-6'} text-white ${!hasCustomColors ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}`}
            style={gradientStyle}
          >
            <div className={`absolute top-0 right-0 opacity-20 ${isSmall ? 'h-20 w-20' : 'h-32 w-32'}`}>
              <Sparkles className="h-full w-full" />
            </div>
            <div className="relative z-10">
              {!isSmall && (
                <div className="mb-4 flex items-center justify-between">
                  <Badge className="border-0 bg-white/20 text-white" variant="secondary">
                    GUEST
                  </Badge>
                  <Badge className="flex items-center gap-1 border-0 bg-white/20 text-white" variant="secondary">
                    {getProviderIcon(user.provider)}
                    {user.provider.toUpperCase()}
                  </Badge>
                </div>
              )}

              <div className="text-center">
                <Avatar className={`mx-auto ${isSmall ? 'mb-2 h-12 w-12 border-2' : 'mb-3 h-16 w-16 border-4'} border-white/30`}>
                  <AvatarImage alt={user.name} src={user.avatar_url} />
                  <AvatarFallback className={`bg-white/20 font-bold text-white ${isSmall ? 'text-sm' : 'text-xl'}`}>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className={`font-bold ${isSmall ? 'text-base' : 'text-xl'}`}>{user.name}</h3>
                {!isSmall && <p className="text-sm text-white/80">{user.email}</p>}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className={isSmall ? 'p-3' : 'p-6'} style={{ backgroundColor: ticketColors.background }}>
            <div className={isSmall ? 'space-y-2' : 'space-y-4'}>
              {!isSmall && (
                <div className="text-center">
                  <h4 className="mb-2 font-semibold text-foreground text-lg">Walter Morales Portfolio</h4>
                  <p className="text-muted-foreground text-sm">Digital Guestbook Visitor</p>
                </div>
              )}

              {!isSmall && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{currentDate}</span>
                </div>
              )}

              <div className={`border-muted border-t border-dashed ${isSmall ? 'pt-2' : 'pt-4'}`}>
                <div className="text-center">
                  <p className={`mb-1 text-muted-foreground ${isSmall ? 'text-[10px]' : 'text-xs'}`}>TICKET ID</p>
                  <code className={`rounded bg-muted px-2 py-1 font-mono text-foreground ${isSmall ? 'text-[10px]' : 'text-xs'}`}>
                    {ticketNumber || `TEMP-${Date.now().toString().slice(-6)}`}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Footer decoration */}
          <div 
            className={`${isSmall ? 'h-1' : 'h-2'} ${!hasCustomColors ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}`}
            style={footerGradientStyle}
          />
        </Card>

        {/* Shadow/reflection effect */}
        {!isSmall && (
          <div className="-bottom-1 absolute right-2 left-2 h-4 rounded-full bg-gradient-to-r from-transparent via-black/10 to-transparent blur-sm" />
        )}
      </div>
    </div>
  );
}
