import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const hexColorRegex = /^#[0-9A-F]{6}$/i;

// Constants
const MAX_USER_NAME_LENGTH = 20;
const MAX_USER_EMAIL_LENGTH = 30;
const VISUAL_PATTERN_COUNT = 6;
const MIN_OPACITY = 10;
const OPACITY_BASE = 100;
const OPACITY_INCREMENT = 15;
const OPACITY_MULTIPLIER = 2.55;
const HEX_PADDING_LENGTH = 2;
const PATTERN_WIDTH = 4;
const PATTERN_HEIGHT_BASE = 40;
const PATTERN_HEIGHT_DECREMENT = 5;
const PATTERN_BORDER_RADIUS = 2;
const PATTERN_MARGIN_RIGHT = 4;
const HEX_BASE = 16;
const PAD_START_VALUE = "0";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "en";

    // Fetch ticket data from a regular API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/tickets/${id}`);

    if (!response.ok) {
      return new Response("Ticket not found", { status: 404 });
    }

    const ticket = await response.json();

    // Validate required fields
    if (!(ticket.primaryColor && ticket.userName && ticket.ticketNumber)) {
      return new Response("Invalid ticket data", { status: 400 });
    }

    // Validate hex colors
    if (
      !(
        hexColorRegex.test(ticket.primaryColor) &&
        hexColorRegex.test(ticket.secondaryColor)
      )
    ) {
      return new Response("Invalid color format", { status: 400 });
    }

    // Translations based on locale
    const translations = {
      en: {
        subtitle: "Digital Guestbook",
        ticketLabel: "Ticket Number",
      },
      es: {
        subtitle: "Libro de visitas digital",
        ticketLabel: "Número de boleto",
      },
    };

    const t =
      translations[locale as keyof typeof translations] || translations.en;

    // Prepare individual text strings for font loading
    const brandText = "Walter Morales";
    const subtitleText = t.subtitle;
    const userName =
      ticket.userName.length > MAX_USER_NAME_LENGTH
        ? `${ticket.userName.substring(0, MAX_USER_NAME_LENGTH)}...`
        : ticket.userName;
    const userEmail =
      ticket.userEmail.length > MAX_USER_EMAIL_LENGTH
        ? `${ticket.userEmail.substring(0, MAX_USER_EMAIL_LENGTH)}...`
        : ticket.userEmail;
    const providerText = ticket.userProvider.toUpperCase();
    const ticketLabelText = t.ticketLabel;
    const ticketNumberText = `#${ticket.ticketNumber}`;

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#111827",
          padding: "64px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Main Ticket */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: ticket.backgroundColor || "#1f1f23",
            boxShadow: "0 40px 80px rgba(0, 0, 0, 0.6)",
            width: "100%",
            maxWidth: "896px",
            height: "384px",
            borderRadius: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "32px 48px",
            }}
          >
            {/* Branding */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                  fontSize: "24px",
                  marginRight: "16px",
                }}
              >
                ✨
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    color: "#e5e7eb",
                    fontWeight: "800",
                    fontSize: "18px",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {brandText}
                </div>
                <div
                  style={{
                    display: "flex",
                    color: "#9ca3af",
                    fontSize: "14px",
                    fontWeight: "500",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {subtitleText}
                </div>
              </div>
            </div>

            {/* Provider Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "12px 20px",
                borderRadius: "9999px",
              }}
            >
              <span style={{ fontSize: "18px", marginRight: "8px" }}>
                {ticket.userProvider === "github" ? "🐙" : "📧"}
              </span>
              <span
                style={{
                  color: "#e5e7eb",
                  fontWeight: "700",
                  fontSize: "14px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {providerText}
              </span>
            </div>
          </div>

          {/* User Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px 48px",
              flex: 1,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "112px",
                height: "112px",
                borderRadius: "50%",
                background: ticket.userAvatar
                  ? "transparent"
                  : `linear-gradient(135deg, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                boxShadow: `0 0 60px ${ticket.primaryColor}40`,
                border: "4px solid rgba(255, 255, 255, 0.1)",
                fontSize: "36px",
                fontWeight: "bold",
                color: "white",
                marginRight: "32px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {ticket.userAvatar ? (
                <img
                  alt={userName}
                  src={ticket.userAvatar}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                ticket.userName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
              )}
            </div>

            {/* User Info */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h1
                style={{
                  color: "white",
                  fontSize: "48px",
                  fontWeight: "900",
                  margin: 0,
                  marginBottom: "8px",
                  letterSpacing: "-0.02em",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {userName}
              </h1>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "20px",
                  fontWeight: "400",
                  margin: 0,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {userEmail}
              </p>
            </div>
          </div>

          {/* Perforated Line */}
          <div
            style={{
              display: "flex",
              height: "2px",
              borderTop: "2px dashed #3f3f46",
              margin: "0 48px",
              position: "relative",
            }}
          >
            {/* Left hole */}
            <div
              style={{
                display: "flex",
                position: "absolute",
                left: "-60px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#111827",
              }}
            />
            {/* Right hole */}
            <div
              style={{
                display: "flex",
                position: "absolute",
                right: "-60px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "#111827",
              }}
            />
          </div>

          {/* Ticket Number Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "32px 48px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  color: "#9ca3af",
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {ticketLabelText}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "36px",
                  fontWeight: "900",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  background: `linear-gradient(to right, ${ticket.primaryColor}, ${ticket.secondaryColor})`,
                  backgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "0.05em",
                }}
              >
                {ticketNumberText}
              </div>
            </div>

            {/* Visual Pattern */}
            <div style={{ display: "flex" }}>
              {[...new Array(VISUAL_PATTERN_COUNT)].map((_, i) => {
                const opacity = Math.max(
                  MIN_OPACITY,
                  OPACITY_BASE - i * OPACITY_INCREMENT
                ); // Prevent negative values
                const opacityHex = Math.floor(opacity * OPACITY_MULTIPLIER)
                  .toString(HEX_BASE)
                  .padStart(HEX_PADDING_LENGTH, PAD_START_VALUE);
                return (
                  <div
                    key={`pattern-${ticket.id}-${i}`}
                    style={{
                      display: "flex",
                      width: `${PATTERN_WIDTH}px`,
                      height: `${PATTERN_HEIGHT_BASE - i * PATTERN_HEIGHT_DECREMENT}px`,
                      background: `linear-gradient(to bottom, ${ticket.primaryColor}${opacityHex}, transparent)`,
                      borderRadius: `${PATTERN_BORDER_RADIUS}px`,
                      marginRight: `${PATTERN_MARGIN_RIGHT}px`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
