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

const getProviderIcon = (provider: string) => {
  switch (provider.toLowerCase()) {
    case 'github':
      return <Github className="h-3 w-3" />;
    case 'google':
      return <Mail className="h-3 w-3" />;
    default:
      return <User className="h-3 w-3" />;
  }
};

const getTicketColors = (colors?: UserTicketProps['colors']) => {
  const hasCustomColors = !!colors;
  return {
    primary: hasCustomColors ? colors.primary : '#8b5cf6',
    secondary: hasCustomColors ? colors.secondary : '#ec4899',
    accent: hasCustomColors ? colors.accent : '#a78bfa',
    background: hasCustomColors ? colors.background || '#1f1f23' : '#1f1f23',
    hasCustom: hasCustomColors,
  };
};

const getTicketStyles = (ticketColors: ReturnType<typeof getTicketColors>) => {
  const gradientStyle = ticketColors.hasCustom
    ? { background: `linear-gradient(135deg, ${ticketColors.primary}, ${ticketColors.secondary})` }
    : undefined;

  const accentGradientStyle = ticketColors.hasCustom
    ? { background: `linear-gradient(to right, ${ticketColors.primary}20, ${ticketColors.secondary}20)` }
    : undefined;

  return { gradientStyle, accentGradientStyle };
};

export function UserTicket({ user, colors, ticketNumber, scale = 'normal' }: UserTicketProps) {
  const ticketColors = getTicketColors(colors);
  const { gradientStyle, accentGradientStyle } = getTicketStyles(ticketColors);
  const isSmall = scale === 'small';

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full">
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-30 blur-2xl" style={gradientStyle} />

        {/* Ticket/Badge */}
        <Card
          className={
            'relative mx-0 w-full overflow-hidden border border-gray-800 px-0 pt-0 shadow-2xl backdrop-blur-sm'
          }
          style={{ backgroundColor: ticketColors.background }}
        >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-5" style={accentGradientStyle} />

          {/* Content */}
          <div className="relative z-10">
            {/* Header Section */}
            <div className={`${isSmall ? 'p-4' : 'p-6'}`}>
              <div className="flex items-start justify-between">
                {/* Avatar and Info */}
                <div className="flex items-center gap-3">
                  <Avatar
                    className={`${isSmall ? 'h-10 w-10' : 'h-12 w-12'} ring-2 ring-gray-700`}
                    style={{
                      boxShadow: `0 0 20px ${ticketColors.primary}40`,
                    }}
                  >
                    <AvatarImage alt={user.name} src={user.avatar_url} />
                    <AvatarFallback
                      className="font-semibold text-xs"
                      style={{
                        background: `linear-gradient(135deg, ${ticketColors.primary}, ${ticketColors.secondary})`,
                        color: 'white',
                      }}
                    >
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className={`font-semibold ${isSmall ? 'text-sm' : 'text-base'} text-gray-100`}>{user.name}</h3>
                    {!isSmall && <p className="text-gray-400 text-xs">{user.email}</p>}
                  </div>
                </div>

                {/* Provider Badge */}
                <Badge
                  className="gap-1 border-gray-700 bg-gray-800/50 px-2 py-0.5 text-gray-300 text-xs"
                  variant="outline"
                >
                  {getProviderIcon(user.provider)}
                  {!isSmall && user.provider}
                </Badge>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

            {/* Footer Section */}
            <div className={`${isSmall ? 'p-3' : 'p-4'} space-y-3`}>
              {/* Date */}
              {!isSmall && (
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{currentDate}</span>
                </div>
              )}

              {/* Ticket Number */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ticketColors.primary }} />
                  <span className={`text-gray-400 ${isSmall ? 'text-[10px]' : 'text-xs'}`}>TICKET ID</span>
                </div>
                <code className={`font-mono ${isSmall ? 'text-[10px]' : 'text-xs'} text-gray-300`}>
                  {ticketNumber || `TEMP-${Date.now().toString().slice(-6)}`}
                </code>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-0.5" style={gradientStyle} />
          </div>
        </Card>

        {/* Decorative Elements */}
        {!isSmall && (
          <>
            {/* Top Right Sparkle */}
            <Sparkles
              className="-top-2 -right-2 absolute h-4 w-4 text-gray-600 opacity-50"
              style={{ color: ticketColors.accent }}
            />
            {/* Bottom Left Sparkle */}
            <Sparkles
              className="-bottom-2 -left-2 absolute h-3 w-3 text-gray-600 opacity-30"
              style={{ color: ticketColors.primary }}
            />
          </>
        )}
      </div>
    </div>
  );
}
