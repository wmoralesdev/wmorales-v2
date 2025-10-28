import { ImageResponse } from "@vercel/og";
import { prisma } from "@/lib/prisma";

// Constants
const MAX_DESCRIPTION_LENGTH = 150;
const DESCRIPTION_TRUNCATE_POSITION = 147;

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    // Fetch shortened URL data
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { code },
    });

    if (!shortUrl) {
      return new Response("Link not found", { status: 404 });
    }

    // Extract domain from the original URL
    let domain = "Link";
    try {
      const url = new URL(shortUrl.url);
      domain = url.hostname.replace("www.", "");
    } catch {
      // Fallback to 'Link' if URL parsing fails
    }

    const title = shortUrl.title || `Shared ${domain}`;
    const description = shortUrl.description || shortUrl.url;

    // Truncate description if too long
    const truncatedDescription =
      description.length > MAX_DESCRIPTION_LENGTH
        ? `${description.substring(0, DESCRIPTION_TRUNCATE_POSITION)}...`
        : description;

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "60px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(15, 15, 15, 0.95)",
            boxShadow: "0 50px 100px rgba(0, 0, 0, 0.5)",
            borderRadius: "32px",
            padding: "48px 56px",
            width: "100%",
            height: "100%",
            maxHeight: "510px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header with branding */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "56px",
                  height: "56px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  marginRight: "20px",
                  fontSize: "28px",
                  flexShrink: 0,
                }}
              >
                🔗
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    color: "#e5e7eb",
                    fontWeight: "800",
                    fontSize: "22px",
                    letterSpacing: "-0.02em",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  wmorales.dev
                </span>
                <span
                  style={{
                    color: "#9ca3af",
                    fontSize: "16px",
                    fontWeight: "500",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  URL Shortener
                </span>
              </div>
            </div>

            {/* Short code badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(102, 126, 234, 0.1)",
                padding: "10px 20px",
                borderRadius: "9999px",
                border: "1px solid rgba(102, 126, 234, 0.2)",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                  backgroundClip: "text",
                  color: "transparent",
                  letterSpacing: "0.05em",
                }}
              >
                {code}
              </span>
            </div>
          </div>

          {/* Main content with better spacing */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                color: "white",
                fontSize: "48px",
                fontWeight: "900",
                margin: "0 0 20px 0",
                lineHeight: "1.2",
                letterSpacing: "-0.03em",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                display: "flex",
                flexWrap: "wrap",
                wordBreak: "break-word",
              }}
            >
              {title}
            </h1>

            <p
              style={{
                color: "#9ca3af",
                fontSize: "22px",
                fontWeight: "400",
                margin: "0",
                lineHeight: "1.5",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                display: "flex",
                flexWrap: "wrap",
                wordBreak: "break-word",
              }}
            >
              {truncatedDescription}
            </p>
          </div>

          {/* Footer with simplified design */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "32px",
              marginTop: "32px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                SHORT URL
              </span>
            </div>

            {/* Domain display */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  color: "#a5b4fc",
                  fontSize: "16px",
                  fontWeight: "500",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                wmorales.dev/r/{code}
              </span>
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
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
