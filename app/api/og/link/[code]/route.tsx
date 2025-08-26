import { ImageResponse } from '@vercel/og';
import { prisma } from '@/lib/prisma';

// Cannot use Edge Runtime with Prisma - using Node.js runtime instead

async function loadGoogleFont(
  font: string,
  text: string
): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params;

    // Fetch shortened URL data
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { code },
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
    const truncatedDescription =
      description.length > 140
        ? `${description.substring(0, 137)}...`
        : description;

    // Prepare text for font loading - include all text that will be displayed
    const allText = `${title} ${truncatedDescription} wmorales.dev/r/${code}`;

    // Load Space Grotesk font
    const fontData = await loadGoogleFont(
      'Space+Grotesk:wght@400;700',
      allText
    );

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: '#0a0a0a',
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
            padding: '80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            {/* Header with logo and short code */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '48px',
              }}
            >
              {/* Logo and brand */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    borderRadius: '12px',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: '#fafafa',
                    fontFamily: 'Space Grotesk',
                  }}
                >
                  W
                </div>
                <span
                  style={{
                    color: '#94a3b8',
                    fontSize: '20px',
                    fontWeight: 400,
                    fontFamily: 'Space Grotesk',
                  }}
                >
                  wmorales.dev
                </span>
              </div>

              {/* Short code badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    fontFamily: 'Space Grotesk',
                    color: '#a78bfa',
                    letterSpacing: '-0.02em',
                  }}
                >
                  /{code}
                </span>
              </div>
            </div>

            {/* Main content - centered */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                gap: '32px',
              }}
            >
              <h1
                style={{
                  color: '#fafafa',
                  fontSize: '72px',
                  fontWeight: 700,
                  margin: '0',
                  lineHeight: '1.1',
                  letterSpacing: '-0.03em',
                  fontFamily: 'Space Grotesk',
                  display: 'flex',
                  flexWrap: 'wrap',
                  wordBreak: 'break-word',
                  textShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '28px',
                  fontWeight: 400,
                  margin: '0',
                  lineHeight: '1.5',
                  fontFamily: 'Space Grotesk',
                  display: 'flex',
                  flexWrap: 'wrap',
                  wordBreak: 'break-word',
                  maxWidth: '95%',
                }}
              >
                {truncatedDescription}
              </p>
            </div>

            {/* Footer with URL and visual elements */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginTop: '48px',
              }}
            >
              {/* URL with icon */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#22c55e',
                    boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
                  }}
                />
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '20px',
                    fontWeight: 400,
                    fontFamily: 'Space Grotesk',
                  }}
                >
                  wmorales.dev/r/{code}
                </span>
              </div>

              {/* Visual elements */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                {/* Purple dots */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: '#8b5cf6',
                      opacity: 0.3 + i * 0.2,
                    }}
                  />
                ))}
                {/* Gradient line */}
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    background:
                      'linear-gradient(to right, rgba(139, 92, 246, 0.3), transparent)',
                    maxWidth: '200px',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Space Grotesk',
            data: fontData,
            style: 'normal',
          },
        ],
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
