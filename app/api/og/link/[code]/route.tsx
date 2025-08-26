import { ImageResponse } from '@vercel/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    // Fetch shortened URL data
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { code }
    });

    if (!shortUrl) {
      return new Response('Link not found', { status: 404 });
    }

    // Extract domain from the original URL
    let domain = 'Link';
    try {
      const url = new URL(shortUrl.url);
      domain = url.hostname.replace('www.', '');
    } catch {
      // Fallback to 'Link' if URL parsing fails
    }

    const title = shortUrl.title || `Shared ${domain}`;
    const description = shortUrl.description || shortUrl.url;

    // Truncate description if too long
    const truncatedDescription = description.length > 120
      ? `${description.substring(0, 117)}...`
      : description;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '80px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(15, 15, 15, 0.95)',
              boxShadow: '0 50px 100px rgba(0, 0, 0, 0.5)',
              borderRadius: '32px',
              padding: '64px',
              width: '100%',
              maxWidth: '1040px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Header with branding */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '48px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  marginRight: '24px',
                  fontSize: '32px',
                }}
              >
                🔗
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    color: '#e5e7eb',
                    fontWeight: '800',
                    fontSize: '24px',
                    letterSpacing: '-0.02em',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  wmorales.dev
                </span>
                <span
                  style={{
                    color: '#9ca3af',
                    fontSize: '18px',
                    fontWeight: '500',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  URL Shortener
                </span>
              </div>
            </div>

            {/* Main content */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <h1
                style={{
                  color: 'white',
                  fontSize: '56px',
                  fontWeight: '900',
                  margin: '0 0 24px 0',
                  lineHeight: '1.1',
                  letterSpacing: '-0.03em',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  color: '#9ca3af',
                  fontSize: '24px',
                  fontWeight: '400',
                  margin: '0 0 48px 0',
                  lineHeight: '1.4',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {truncatedDescription}
              </p>
            </div>

            {/* Footer with code */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '32px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '20px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginRight: '16px',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  Short Code:
                </span>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: '900',
                    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '0.05em',
                  }}
                >
                  {code}
                </span>
              </div>

              {/* Visual indicator */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>
                    👆
                  </span>
                  <span
                    style={{
                      color: '#a5b4fc',
                      fontWeight: '700',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                  >
                    Click to Visit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}

