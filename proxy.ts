import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  // Step 1: Initialize Supabase response object
  // Create a NextResponse that will be used to handle Supabase authentication
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Step 2: Retrieve Supabase configuration from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Step 3: Validate required Supabase environment variables
  // Ensure both URL and anon key are present to prevent runtime errors
  if (!(supabaseUrl && supabaseAnonKey)) {
    throw new Error("Missing Supabase URL or Anon Key");
  }

  // Step 4: Create Supabase server client with cookie handling
  // Configure the client to properly manage authentication cookies in middleware
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Step 4a: Implement cookie getter
      // Return all cookies from the incoming request
      getAll() {
        return request.cookies.getAll();
      },
      // Step 4b: Implement cookie setter
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

  // Step 5: Refresh user session
  // Retrieve current user to refresh the session and update cookies
  await supabase.auth.getUser();

  // Step 6: Handle authentication callback route
  // Allow auth callback to proceed without additional processing
  if (request.nextUrl.pathname === "/auth/callback") {
    return supabaseResponse;
  }

  // Step 7: Return the response with updated authentication state
  // Send the response with any updated cookies and session information
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - r (redirect routes)
     * - slides (presentation routes - not localized, fully static)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public folder files (images, videos, etc.)
     */
    "/((?!api|r/|slides|_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webm|mp4|mp3|ogg|pdf|zip)$).*)",
  ],
};
