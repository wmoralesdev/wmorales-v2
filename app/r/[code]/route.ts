import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Generate HTML page with OG metadata
// biome-ignore lint/suspicious/noExplicitAny: Prisma query result types
function generateOGPage(shortUrl: any, baseUrl: string): string {
  const title = shortUrl.title || "Shared Link";
  const description =
    shortUrl.description || "Click to view the shared content";
  const image = shortUrl.image || `${baseUrl}/api/og/link/${shortUrl.code}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${title}">
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/r/${shortUrl.code}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${baseUrl}/r/${shortUrl.code}">
  <meta property="twitter:title" content="${title}">
  <meta property="twitter:description" content="${description}">
  <meta property="twitter:image" content="${image}">
  
  <!-- Redirect after metadata is parsed -->
  <meta http-equiv="refresh" content="0; url='${shortUrl.url}'">
  
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0a0a;
      color: #fafafa;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      color: #888;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    .spinner {
      border: 3px solid #333;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
  
  <script>
    // Immediate redirect via JavaScript as backup
    window.location.href = '${shortUrl.url}';
  </script>
</head>
<body>
  <div class="container">
    <h1>Redirecting...</h1>
    <div class="spinner"></div>
    <p>If you are not redirected automatically,<br><a href="${shortUrl.url}">click here to continue</a></p>
  </div>
</body>
</html>`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Find the short URL
    const shortUrlEntry = await prisma.shortUrl.findUnique({
      where: { code },
    });

    if (!shortUrlEntry) {
      // Return a 404 page
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>Link Not Found</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0a0a;
      color: #fafafa;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: #888;
      font-size: 1.125rem;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <p>This link does not exist or has expired.</p>
    <p><a href="/">Go to homepage</a></p>
  </div>
</body>
</html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Check if the URL has expired
    if (shortUrlEntry.expiresAt && shortUrlEntry.expiresAt < new Date()) {
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <title>Link Expired</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0a0a;
      color: #fafafa;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: #888;
      font-size: 1.125rem;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Link Expired</h1>
    <p>This shortened link has expired.</p>
    <p><a href="/">Go to homepage</a></p>
  </div>
</body>
</html>`,
        {
          status: 410, // Gone
          headers: { "Content-Type": "text/html" },
        }
      );
    }

    // Increment click counter (fire and forget, don't wait)
    prisma.shortUrl
      .update({
        where: { code },
        data: { clicks: { increment: 1 } },
      })
      .catch((error) => {
        console.error("Failed to increment click counter:", error);
      });

    // Check if the request is from a bot/crawler that needs OG metadata
    const userAgent = request.headers.get("user-agent") || "";
    const isBot =
      /bot|crawler|spider|slack|telegram|whatsapp|facebook|twitter|linkedin|discord/i.test(
        userAgent
      );

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      `https://${request.headers.get("host")}`;

    if (
      isBot ||
      shortUrlEntry.title ||
      shortUrlEntry.description ||
      shortUrlEntry.image
    ) {
      // Return HTML with OG metadata for bots or if custom metadata is set
      return new NextResponse(generateOGPage(shortUrlEntry, baseUrl), {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    // For regular browsers without custom metadata, do a direct redirect
    return NextResponse.redirect(shortUrlEntry.url, {
      status: 301, // Permanent redirect for better performance
    });
  } catch (error) {
    console.error("Error processing redirect:", error);

    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #0a0a0a;
      color: #fafafa;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    p {
      color: #888;
      font-size: 1.125rem;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Error</h1>
    <p>Something went wrong while processing this link.</p>
    <p><a href="/">Go to homepage</a></p>
  </div>
</body>
</html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
}
