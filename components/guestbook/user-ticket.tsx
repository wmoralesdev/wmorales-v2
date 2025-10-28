import { Github, Mail, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Constants
const TIMESTAMP_SLICE_LENGTH = 6;

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
  scale?: "normal" | "small";
};

const getProviderIcon = (provider: string) => {
  switch (provider.toLowerCase()) {
    case "github":
      return <Github className="h-3 w-3" />;
    case "google":
      return <Mail className="h-3 w-3" />;
    default:
      return <User className="h-3 w-3" />;
  }
};

const getTicketColors = (colors?: UserTicketProps["colors"]) => {
  const hasCustomColors = !!colors;
  return {
    primary: hasCustomColors ? colors.primary : "#8b5cf6",
    secondary: hasCustomColors ? colors.secondary : "#ec4899",
    accent: hasCustomColors ? colors.accent : "#a78bfa",
    background: hasCustomColors ? colors.background || "#1f1f23" : "#1f1f23",
    hasCustom: hasCustomColors,
  };
};

export function UserTicket({
  user,
  colors,
  ticketNumber,
  scale = "normal",
}: UserTicketProps) {
  const ticketColors = getTicketColors(colors);
  const isSmall = scale === "small";

  const generateKeyFromColors = () => {
    if (!colors) {
      return ticketNumber || "";
    }

    return `${Object.values(colors).join("-")}-${ticketNumber || ""}`;
  };

  return (
    <div className="flex w-full justify-center">
      <div className="relative w-full max-w-[600px]">
        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-[32px] opacity-30 blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${ticketColors.primary}, ${ticketColors.secondary})`,
          }}
        />

        {/* Ticket Container with Cut Corners */}
        <div
          className="relative overflow-hidden rounded-[32px] shadow-2xl"
          style={{
            background: ticketColors.background,
            clipPath:
              "polygon(0 40px, 40px 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
          }}
        >
          {/* Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(${ticketColors.primary} 1px, transparent 1px), linear-gradient(90deg, ${ticketColors.primary} 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at 30% 20%, ${ticketColors.primary}40, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative">
            {/* Header Section */}
            <div className={`${isSmall ? "px-6 py-4" : "px-8 py-6"} pb-0`}>
              <div className="mb-6 flex items-center justify-between">
                {/* Conference Branding */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${ticketColors.primary}, ${ticketColors.secondary})`,
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-300 text-xs uppercase tracking-wider">
                      Cursor meetup
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      Digital Guestbook
                    </p>
                  </div>
                </div>

                {/* Provider Badge */}
                <Badge
                  className="gap-1 border-0 bg-gray-800/60 px-3 py-1 text-gray-300 text-xs backdrop-blur-sm"
                  variant="secondary"
                >
                  {getProviderIcon(user.provider)}
                  <span className="font-medium">{user.provider}</span>
                </Badge>
              </div>

              {/* User Info Section */}
              <div className={`${isSmall ? "py-6" : "py-8"}`}>
                <div className="flex items-center gap-5">
                  <Avatar
                    className={`${isSmall ? "h-16 w-16" : "h-20 w-20"} ring-4 ring-gray-800`}
                    style={{
                      boxShadow: `0 0 40px ${ticketColors.primary}30`,
                    }}
                  >
                    <AvatarImage alt={user.name} src={user.avatar_url} />
                    <AvatarFallback
                      className="font-bold text-lg"
                      style={{
                        background: `linear-gradient(135deg, ${ticketColors.primary}, ${ticketColors.secondary})`,
                        color: "white",
                      }}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2
                      className={`font-bold ${isSmall ? "text-xl" : "text-2xl"} mb-1 text-white`}
                    >
                      {user.name}
                    </h2>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Perforated Line */}
            <div className="relative mx-8 h-0 border-gray-700 border-t-2 border-dashed">
              <div className="-left-10 -translate-y-1/2 absolute top-1/2 h-6 w-6 rounded-full bg-black" />
              <div className="-right-10 -translate-y-1/2 absolute top-1/2 h-6 w-6 rounded-full bg-black" />
            </div>

            {/* Ticket Number Section */}
            <div className={`${isSmall ? "px-6 py-4" : "px-8 py-6"} pt-6`}>
              <div className="flex items-end justify-between">
                <div>
                  <p className="mb-2 text-[10px] text-gray-500 uppercase tracking-wider">
                    Ticket Number
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`font-bold font-mono ${isSmall ? "text-2xl" : "text-3xl"}`}
                      key={generateKeyFromColors()}
                      style={{
                        background: `linear-gradient(to right, ${ticketColors.primary}, ${ticketColors.secondary})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      #{ticketNumber ||
                        `${Date.now().toString().slice(-TIMESTAMP_SLICE_LENGTH)}`}
                    </span>
                  </div>
                </div>

                {/* Visual Pattern */}
                <div className="flex gap-1">
                  {[...new Array(4)].map((_, i) => {
                    const height = Math.max(20, 100 - i * 25);
                    return (
                      <div
                        className="h-8 w-1"
                        key={`pattern-bar-height-${height}`}
                        style={{
                          background: `linear-gradient(to bottom, ${ticketColors.primary}${height.toString(16)}, transparent)`,
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Accent */}
        <div
          className="-top-2 -right-2 absolute h-16 w-16 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${ticketColors.accent}, transparent 70%)`,
          }}
        />
      </div>
    </div>
  );
}
