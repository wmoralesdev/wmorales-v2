# Authentication Implementation

This project implements Supabase authentication with support for Google, GitHub OAuth, and OTP (One-Time Password) authentication methods.

## Features

- ✅ Google OAuth authentication
- ✅ GitHub OAuth authentication  
- ✅ Email OTP authentication (code-based, not magic link)
- ✅ Login page at `/login` route
- ✅ Redirect functionality after authentication
- ✅ Protected routes with authentication guards
- ✅ User navigation with profile display
- ✅ Sign out functionality
- ✅ React Hook Form integration
- ✅ shadcn/ui form components

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase Project Configuration

In your Supabase dashboard:

1. **Authentication Settings:**
   - Go to Authentication > Settings
   - Set Site URL: `http://localhost:3000` (development) or your production URL
   - Add Redirect URLs: 
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

2. **OAuth Providers:**
   - **GitHub:** Go to Authentication > Providers > GitHub
     - Enable GitHub provider
     - Add your GitHub OAuth App credentials
   - **Google:** Go to Authentication > Providers > Google
     - Enable Google provider
     - Add your Google OAuth credentials

3. **Email Settings:**
   - Go to Authentication > Templates
   - Customize the "Confirm signup" template for OTP codes
   - Make sure OTP is enabled (this is the default)

## Authentication Flow

### 1. Login Process

Users can access the login page at `/login` with three authentication options:

- **Quick Sign In Tab:** Google and GitHub OAuth buttons
- **Email Code Tab:** Email OTP form

### 2. OAuth Flow (GitHub/Google)

1. User clicks GitHub/Google button
2. Redirected to provider's OAuth page
3. After authorization, redirected to `/auth/callback`
4. Callback exchanges code for session
5. User redirected to original page or home

### 3. OTP Flow

1. User enters email address
2. OTP code sent to email
3. User enters 6-digit code
4. Code verified and user signed in
5. Redirected to original page or home

### 4. Protected Routes

Routes can be protected using the `AuthGuard` component:

```tsx
import { AuthGuard } from '@/components/auth/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content requires authentication</div>
    </AuthGuard>
  )
}
```

## Components Overview

### Core Authentication

- **`lib/auth.ts`** - Authentication service class with all auth methods
- **`lib/supabase/client.ts`** - Browser-side Supabase client
- **`lib/supabase/server.ts`** - Server-side Supabase client
- **`middleware.ts`** - Handles session refresh and auth callbacks

### React Components

- **`components/auth/auth-provider.tsx`** - Context provider for auth state
- **`components/auth/auth-guard.tsx`** - Route protection component
- **`components/auth/login-form.tsx`** - Main login form with tabs
- **`components/auth/otp-form.tsx`** - OTP verification form
- **`components/auth/user-nav.tsx`** - User dropdown menu
- **`components/auth/sign-in-button.tsx`** - Conditional sign-in/user nav button

### Pages & Routes

- **`app/login/page.tsx`** - Login page
- **`app/auth/callback/route.ts`** - OAuth callback handler

## Usage Examples

### Using the Auth Hook

```tsx
'use client'

import { useAuth } from '@/components/auth/auth-provider'

export function MyComponent() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Protecting a Route

```tsx
import { AuthGuard } from '@/components/auth/auth-guard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Protected content here</div>
    </AuthGuard>
  )
}
```

### Adding Sign In Button

```tsx
import { SignInButton } from '@/components/auth/sign-in-button'

export function Header() {
  return (
    <header>
      <nav>
        {/* Other nav items */}
        <SignInButton variant="outline" size="sm" />
      </nav>
    </header>
  )
}
```

## Redirect Logic

The authentication system supports redirect URLs:

1. **Automatic Redirect:** When a user tries to access a protected route, they're redirected to `/login?redirectTo=/original-path`
2. **Post-Login Redirect:** After successful authentication, users are redirected back to the original page
3. **OAuth Redirect:** OAuth providers redirect through `/auth/callback?next=/original-path`

## Error Handling

- Form validation errors are displayed inline using React Hook Form
- Authentication errors show toast notifications
- Network errors are caught and displayed to users
- Invalid OTP codes show error messages with retry options

## Security Considerations

- All authentication is handled server-side through Supabase
- Client-side code only manages UI state and user sessions
- Environment variables are properly scoped (NEXT_PUBLIC_ for client-side)
- OAuth redirects go through secure callback endpoints
- Sessions are automatically refreshed via middleware

## Customization

### Styling
All components use shadcn/ui and Tailwind CSS classes. Customize by:
- Modifying component class names
- Updating the global CSS theme
- Customizing shadcn/ui component styles

### Form Validation
Forms use Zod schemas for validation. Customize by:
- Modifying schema definitions in form components
- Adding custom validation rules
- Updating error messages

### User Interface
The login form uses a tabbed interface. Customize by:
- Modifying the LoginForm component
- Changing tab layouts or adding new auth methods
- Updating styling and animations

## Troubleshooting

### Common Issues

1. **OAuth redirect errors:** Check Supabase redirect URL configuration
2. **Environment variables:** Ensure `.env.local` is properly set up
3. **OTP not receiving:** Check Supabase email template configuration
4. **Session not persisting:** Verify middleware configuration

### Development Tips

- Use Supabase local development for testing
- Check browser network tab for auth API calls
- Monitor Supabase dashboard for auth logs
- Test with different email providers for OTP delivery

## Production Deployment

1. Update environment variables with production Supabase credentials
2. Configure production redirect URLs in Supabase dashboard
3. Set up custom email templates for better branding
4. Consider implementing rate limiting for auth endpoints
5. Monitor authentication metrics and error rates

## Next Steps

Potential enhancements:
- Add password-based authentication
- Implement social logins (Twitter, LinkedIn, etc.)
- Add multi-factor authentication (MFA)
- Create user profile management
- Add role-based access control (RBAC)
- Implement account deletion functionality