import { createServerClient } from '@supabase/ssr';
import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Step 1: Handle internationalization first
  // Process the request through the i18n middleware to handle locale routing
  const intlResponse = intlMiddleware(request);

  // Step 2: Check if internationalization middleware requires a redirect
  // If intl middleware returns a redirect (307 or 302), return it immediately
  // This ensures proper locale handling before any authentication logic
  if (intlResponse.status === 307 || intlResponse.status === 302) {
    return intlResponse;
  }

  // Step 3: Initialize Supabase response object
  // Create a NextResponse that will be used to handle Supabase authentication
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Step 4: Retrieve Supabase configuration from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Step 5: Validate required Supabase environment variables
  // Ensure both URL and anon key are present to prevent runtime errors
  if (!(supabaseUrl && supabaseAnonKey)) {
    throw new Error('Missing Supabase URL or Anon Key');
  }

  // Step 6: Create Supabase server client with cookie handling
  // Configure the client to properly manage authentication cookies in middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Step 6a: Implement cookie getter
      // Return all cookies from the incoming request
      getAll() {
        return request.cookies.getAll();
      },
      // Step 6b: Implement cookie setter
      // Handle setting cookies on both request and response objects
      setAll(cookiesToSet) {
        // Set cookies on the request object for immediate use
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        // Create new response with updated request
        supabaseResponse = NextResponse.next({
          request,
        });
        // Set cookies on the response object to send to client
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // Step 7: Refresh user session
  // Retrieve current user to refresh the session and update cookies
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: { user },
  } = await supabase.auth.getUser();

  // Step 8: Handle authentication callback route
  // Allow auth callback to proceed without additional processing
  if (request.nextUrl.pathname === '/auth/callback') {
    return supabaseResponse;
  }

  // Step 9: Return the response with updated authentication state
  // Send the response with any updated cookies and session information
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
