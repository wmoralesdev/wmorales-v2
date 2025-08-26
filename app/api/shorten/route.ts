import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';

// Get API key from environment variable
const API_KEY = process.env.URL_SHORTENER_API_KEY;

// Generate a short, readable code
// Use a custom alphabet without ambiguous characters (no 0, O, l, I)
const generateShortCode = customAlphabet(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
  7
);

export async function POST(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get('x-api-key');

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'URL shortener API is not configured' },
        { status: 503 }
      );
    }

    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { url, expiresInDays, customCode, title, description, image } = body;

    // Validate URL
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate custom code if provided
    let code = customCode;
    if (customCode) {
      // Ensure custom code is alphanumeric and not too long
      if (!/^[a-zA-Z0-9_-]{3,20}$/.test(customCode)) {
        return NextResponse.json(
          {
            error:
              'Custom code must be 3-20 characters and contain only letters, numbers, underscores, and hyphens',
          },
          { status: 400 }
        );
      }

      // Check if custom code already exists
      const existingCode = await prisma.shortUrl.findUnique({
        where: { code: customCode },
      });

      if (existingCode) {
        return NextResponse.json(
          { error: 'Custom code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate a unique short code
      let attempts = 0;
      do {
        code = generateShortCode();
        const existing = await prisma.shortUrl.findUnique({
          where: { code },
        });
        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      if (!code) {
        return NextResponse.json(
          { error: 'Failed to generate unique code' },
          { status: 500 }
        );
      }
    }

    // Check if URL already exists with same metadata
    if (!customCode) {
      const existingShortUrl = await prisma.shortUrl.findFirst({
        where: {
          url,
          title: title || null,
          description: description || null,
          image: image || null,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (
        existingShortUrl &&
        (!existingShortUrl.expiresAt || existingShortUrl.expiresAt > new Date())
      ) {
        // Return existing non-expired short URL
        const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('host')}/r/${existingShortUrl.code}`;

        return NextResponse.json({
          shortUrl,
          code: existingShortUrl.code,
          originalUrl: existingShortUrl.url,
          title: existingShortUrl.title,
          description: existingShortUrl.description,
          image: existingShortUrl.image,
          clicks: existingShortUrl.clicks,
          createdAt: existingShortUrl.createdAt,
          expiresAt: existingShortUrl.expiresAt,
        });
      }
    }

    // Calculate expiration date if provided
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    // Create new short URL with OG metadata
    const shortUrlEntry = await prisma.shortUrl.create({
      data: {
        code,
        url,
        title: title || null,
        description: description || null,
        image: image || null,
        expiresAt,
      },
    });

    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('host')}/r/${shortUrlEntry.code}`;

    return NextResponse.json({
      shortUrl,
      code: shortUrlEntry.code,
      originalUrl: shortUrlEntry.url,
      title: shortUrlEntry.title,
      description: shortUrlEntry.description,
      image: shortUrlEntry.image,
      clicks: 0,
      createdAt: shortUrlEntry.createdAt,
      expiresAt: shortUrlEntry.expiresAt,
    });
  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get('x-api-key');

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'URL shortener API is not configured' },
        { status: 503 }
      );
    }

    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      // Return list of all short URLs
      const shortUrls = await prisma.shortUrl.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to last 100 URLs
      });

      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || request.headers.get('host');

      return NextResponse.json({
        urls: shortUrls.map((entry) => ({
          shortUrl: `${baseUrl}/r/${entry.code}`,
          code: entry.code,
          originalUrl: entry.url,
          title: entry.title,
          description: entry.description,
          image: entry.image,
          clicks: entry.clicks,
          createdAt: entry.createdAt,
          expiresAt: entry.expiresAt,
          isExpired: entry.expiresAt ? entry.expiresAt < new Date() : false,
        })),
      });
    }

    // Get specific short URL by code
    const shortUrlEntry = await prisma.shortUrl.findUnique({
      where: { code },
    });

    if (!shortUrlEntry) {
      return NextResponse.json(
        { error: 'Short URL not found' },
        { status: 404 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || request.headers.get('host');

    return NextResponse.json({
      shortUrl: `${baseUrl}/r/${shortUrlEntry.code}`,
      code: shortUrlEntry.code,
      originalUrl: shortUrlEntry.url,
      title: shortUrlEntry.title,
      description: shortUrlEntry.description,
      image: shortUrlEntry.image,
      clicks: shortUrlEntry.clicks,
      createdAt: shortUrlEntry.createdAt,
      expiresAt: shortUrlEntry.expiresAt,
      isExpired: shortUrlEntry.expiresAt
        ? shortUrlEntry.expiresAt < new Date()
        : false,
    });
  } catch (error) {
    console.error('Error fetching short URLs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch short URLs' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check API key
    const apiKey = request.headers.get('x-api-key');

    if (!API_KEY) {
      return NextResponse.json(
        { error: 'URL shortener API is not configured' },
        { status: 503 }
      );
    }

    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    // Delete the short URL
    const deletedUrl = await prisma.shortUrl.delete({
      where: { code },
    });

    return NextResponse.json({
      message: 'Short URL deleted successfully',
      code: deletedUrl.code,
      originalUrl: deletedUrl.url,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Short URL not found' },
        { status: 404 }
      );
    }

    console.error('Error deleting short URL:', error);
    return NextResponse.json(
      { error: 'Failed to delete short URL' },
      { status: 500 }
    );
  }
}
