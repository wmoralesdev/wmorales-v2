# Surveys Feature Setup Guide

## Overview

This guide will help you set up the refactored surveys feature that uses:
- **Types** instead of interfaces
- **Prisma** for database management
- **Server Actions** for data operations
- A pre-built contact info survey for testing

## Setup Steps

### 1. Configure Database URL

Add your Supabase database URL to your `.env` file:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?schema=public"
```

You can find this in your Supabase project settings under Settings > Database > Connection string.

### 2. Generate Prisma Client

Run the following command to generate the Prisma client:

```bash
pnpm prisma:generate
# or
npx prisma generate
```

### 3. Run Database Migrations

Create the database tables by running:

```bash
pnpm prisma:migrate
# or
npx prisma migrate dev --name init
```

### 4. Seed the Database

Populate the database with a sample contact info survey:

```bash
pnpm prisma:seed
# or
npx prisma db seed
```

This will create a "Contact Information Survey" with the following questions:
- Full name (required text)
- Email address (required text)
- Phone number (optional text)
- Preferred contact method (required radio)
- How did you hear about us (optional select)
- Topics of interest (optional checkbox)
- Additional comments (optional textarea)

### 5. Test the Survey

After seeding, you'll see URLs in the console output:
- Survey list: http://localhost:3000/surveys
- Fill survey: http://localhost:3000/surveys/[survey-id]/fill
- View results: http://localhost:3000/surveys/[survey-id]

## Key Changes from Previous Version

### 1. Types Instead of Interfaces
All interfaces have been replaced with types:
```typescript
// Old
interface Survey { ... }

// New
type Survey = { ... }
```

### 2. Server Actions
Instead of direct Supabase calls, we now use server actions:
```typescript
// Old
const supabase = createClient();
const { data } = await supabase.from('surveys').select();

// New
const { data } = await getActiveSurveys();
```

### 3. Prisma Schema
Database schema is now managed through Prisma (`prisma/schema.prisma`) instead of raw SQL migrations.

## Architecture

### File Structure
```
/app
  /actions
    survey.actions.ts    # Server actions for surveys
  /(main)
    /surveys
      page.tsx          # Survey list
      /[id]
        page.tsx        # Survey results
        /fill
          page.tsx      # Survey form

/components
  /surveys
    survey-renderer.tsx  # Main survey engine
    question-renderer.tsx # Question type renderer

/lib
  /types
    survey.types.ts     # Type definitions
  prisma.ts            # Prisma client instance

/prisma
  schema.prisma        # Database schema
  seed.ts             # Database seeding
```

### Server Actions Available

- `getActiveSurveys()` - Fetch all active surveys
- `getSurveyWithSections(id)` - Get survey with all sections/questions
- `createSurveyResponse(surveyId)` - Start a new response session
- `saveSurveyAnswer(responseId, questionId, answer)` - Save an answer
- `completeSurveyResponse(responseId)` - Mark response as complete
- `getSurveyResults(surveyId)` - Get survey analytics

## Troubleshooting

### Prisma Client Generation Error
If you see "Module '@prisma/client' has no exported member", run:
```bash
pnpm prisma:generate
```

### Database Connection Issues
1. Verify your DATABASE_URL is correct
2. Check if your database is accessible
3. Ensure SSL is configured if required:
   ```env
   DATABASE_URL="...?sslmode=require"
   ```

### Type Errors
The survey renderer expects specific type shapes. If you encounter type errors:
1. Check that your data matches the types in `lib/types/survey.types.ts`
2. Ensure all nullable fields are properly handled
3. Use type assertions when needed: `as SurveyWithSections`

## Next Steps

1. Create more surveys through Prisma Studio: `npx prisma studio`
2. Customize the survey renderer for your needs
3. Add more question types if needed
4. Implement survey analytics dashboard
5. Add survey templates feature