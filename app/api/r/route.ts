import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (apiKey !== process.env.URL_SHORTENER_API_KEY) {
    return Response.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const shortUrls = await prisma.shortUrl.findMany();
  return Response.json(shortUrls);
}