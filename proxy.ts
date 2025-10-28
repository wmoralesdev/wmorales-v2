import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Step 1: Skip i18n for API routes, redirect routes, and auth callback
  // These routes should not have locale prefixes
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isRedirectRoute = request.nextUrl.pathname.startsWith("/r/");
  const isAuthCallback = request.nextUrl.pathname.startsWith("/auth/callback");

  // Step 2: Handle internationalization for routes that need it
  // Process the request through the i18n middleware to handle locale routing
  if (!(isApiRoute || isRedirectRoute || isAuthCallback)) {
    const intlResponse = intlMiddleware(request);

    // Check if internationalization middleware requires a redirect
    // If intl middleware returns a redirect (307 or 302), return it immediately
    // This ensures proper locale handling before any authentication logic
    const REDIRECT_STATUS_CODE_307 = 307;
    const REDIRECT_STATUS_CODE_302 = 302;
    if (
      intlResponse.status === REDIRECT_STATUS_CODE_307 ||
      intlResponse.status === REDIRECT_STATUS_CODE_302
    ) {
      return intlResponse;
    }
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
    throw new Error("Missing Supabase URL or Anon Key");
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
  await supabase.auth.getUser();

  // Step 8: Handle authentication callback route
  // Allow auth callback to proceed without additional processing
  if (request.nextUrl.pathname === "/auth/callback") {
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
     * - r (redirect routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public folder files (images, videos, etc.)
     */
    "/((?!api|r/|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|mp3|ogg|pdf|zip)$).*)",
  ],
};
