# URL Shortener API Documentation

## Setup

1. **Add environment variable** to your `.env.local`:

```env
URL_SHORTENER_API_KEY=your-secure-api-key-here
```

2. **Run database migration** to create the `short_urls` table:

```bash
pnpm prisma migrate dev
```

## API Endpoints

### 1. Create Short URL

**Endpoint:** `POST /api/shorten`  
**Headers:** `x-api-key: your-api-key`

#### Request Body

```json
{
  "url": "https://meet.google.com/very-long-meeting-url",
  "customCode": "team-standup", // Optional: custom short code
  "title": "Team Standup Meeting", // Optional: OG title
  "description": "Weekly team sync", // Optional: OG description
  "image": "https://example.com/meeting.jpg", // Optional: OG image
  "expiresInDays": 7 // Optional: expiration in days
}
```

#### Response

```json
{
  "shortUrl": "https://wmorales.dev/r/team-standup",
  "code": "team-standup",
  "originalUrl": "https://meet.google.com/very-long-meeting-url",
  "title": "Team Standup Meeting",
  "description": "Weekly team sync",
  "image": "https://example.com/meeting.jpg",
  "clicks": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": "2024-01-08T00:00:00Z"
}
```

### 2. Get Short URL Info

**Endpoint:** `GET /api/shorten?code={code}`  
**Headers:** `x-api-key: your-api-key`

#### Response

```json
{
  "shortUrl": "https://wmorales.dev/r/abc123",
  "code": "abc123",
  "originalUrl": "https://example.com",
  "clicks": 42,
  "createdAt": "2024-01-01T00:00:00Z",
  "expiresAt": null,
  "isExpired": false
}
```

### 3. List All Short URLs

**Endpoint:** `GET /api/shorten`  
**Headers:** `x-api-key: your-api-key`

Returns the last 100 shortened URLs.

### 4. Delete Short URL

**Endpoint:** `DELETE /api/shorten?code={code}`  
**Headers:** `x-api-key: your-api-key`

## Features

### Short Code Generation

- **Automatic:** 7-character codes using safe alphabet (no ambiguous characters like 0/O, l/I)
- **Custom:** Provide your own code (3-20 characters, alphanumeric + underscore/hyphen)
- Examples: `Kx9mN3p`, `team-meeting`, `webinar_2024`

### Open Graph (OG) Metadata

When sharing links on Slack, WhatsApp, Twitter, etc., the shortened URL will display:

- Custom title (or auto-generated from domain)
- Custom description (or the original URL)
- Custom image (or auto-generated OG image with your branding)

### Auto-generated OG Image

If no custom image is provided, the system generates a beautiful OG image featuring:

- Your domain branding (wmorales.dev)
- The title and description
- The short code
- Professional gradient design

## Example Usage

### cURL Example

```bash
# Create a short URL with custom metadata
curl -X POST https://wmorales.dev/api/shorten \
  -H "x-api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://zoom.us/j/123456789",
    "customCode": "product-demo",
    "title": "Product Demo - Q1 2024",
    "description": "Join our live product demonstration showcasing new features",
    "expiresInDays": 30
  }'
```

### JavaScript/TypeScript Example

```typescript
async function createShortUrl(url: string, metadata?: any) {
  const response = await fetch('https://wmorales.dev/api/shorten', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.URL_SHORTENER_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      ...metadata,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to shorten URL: ${response.statusText}`);
  }

  return response.json();
}

// Usage
const shortened = await createShortUrl('https://meet.google.com/abc-defg-hij', {
  customCode: 'weekly-standup',
  title: 'Engineering Weekly Standup',
  description: 'Join our weekly engineering team sync',
  expiresInDays: 7,
});

console.log(`Share this link: ${shortened.shortUrl}`);
```

## How It Works

1. **Direct Access:** When users click the link directly, they're instantly redirected to the original URL
2. **Social Media Preview:** When shared on Slack, Discord, WhatsApp, etc., the bot/crawler receives an HTML page with OG metadata, displaying a rich preview
3. **Analytics:** Each click is tracked (increments counter)
4. **Expiration:** Links can optionally expire after a set number of days

## Best Practices

1. **Use descriptive custom codes** for recurring meetings: `weekly-standup`, `product-demo-2024`
2. **Add metadata** for better social sharing experience
3. **Set expiration** for time-sensitive content
4. **Keep your API key secure** - never expose it in client-side code

## Rate Limits & Security

- API key required for all operations
- Links are public once created (no authentication required to access)
- Consider implementing rate limiting in production
- Regularly rotate your API key
