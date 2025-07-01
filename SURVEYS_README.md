# Surveys Feature Documentation

## Overview

The surveys feature provides a powerful graph-based survey system where answers can dynamically route users to different sections based on their responses. This enables creating complex, branching surveys that adapt to user input.

## Key Features

- **Graph-based Navigation**: Answers can redirect to specific sections
- **Multiple Question Types**: Text, textarea, radio, checkbox, select
- **Real-time Results Dashboard**: View survey responses as they come in
- **Anonymous & Authenticated**: Supports both logged-in and anonymous users
- **Beautiful Animations**: Smooth transitions using Framer Motion
- **Type-safe**: Full TypeScript support with Zod validation

## Database Setup

1. Navigate to your Supabase project dashboard
2. Go to SQL Editor
3. Run the migration script located at `supabase/migrations/create_surveys_schema.sql`
4. This will create all necessary tables with proper RLS policies

## Architecture

### Database Schema

- `surveys`: Main survey metadata
- `survey_sections`: Survey sections with optional path routing
- `survey_questions`: Questions within sections
- `survey_question_options`: Options for radio/checkbox/select questions
- `survey_responses`: User response sessions
- `survey_answers`: Individual question answers
- `survey_answer_options`: Selected options for multi-choice questions

### Components

1. **SurveyRenderer** (`components/surveys/survey-renderer.tsx`)
   - Core rendering engine
   - Handles graph-based navigation
   - Manages form state with react-hook-form
   - Implements path routing based on answers

2. **QuestionRenderer** (`components/surveys/question-renderer.tsx`)
   - Renders different question types
   - Handles validation
   - Supports all input types

### Pages

- `/surveys`: Lists all active surveys
- `/surveys/[id]`: Survey results dashboard
- `/surveys/[id]/fill`: Survey filling interface

## Usage Example

### Creating a Survey (via Supabase Dashboard)

```sql
-- Insert a survey
INSERT INTO surveys (title, description, status)
VALUES ('Developer Experience', 'Help us understand your workflow', 'active');

-- Insert sections
INSERT INTO survey_sections (survey_id, section_order, title, description)
VALUES 
  ('survey-id', 1, 'About You', 'Basic information'),
  ('survey-id', 2, 'Developer Questions', 'For developers', 'developer-path'),
  ('survey-id', 3, 'Investor Questions', 'For investors', 'investor-path');

-- Insert questions with routing
INSERT INTO survey_questions (section_id, question_order, question, type, required)
VALUES ('section-1-id', 1, 'Are you a developer or investor?', 'radio', true);

-- Insert options with paths
INSERT INTO survey_question_options (question_id, option_order, label, value, path)
VALUES 
  ('question-id', 1, 'Developer', 'developer', 'developer-path'),
  ('question-id', 2, 'Investor', 'investor', 'investor-path');
```

## Graph-based Flow

The survey system uses a graph structure where:
1. Each section can have an optional `path` identifier
2. Question options can specify a `path` to navigate to
3. When a user selects an option with a path, they're routed to the matching section
4. This enables complex branching logic

Example flow:
```
Start → About You → [Developer/Investor?]
                    ↓              ↓
            Developer Path    Investor Path
                    ↓              ↓
           Tech Questions   Investment Questions
                    ↓              ↓
                    → Complete ←
```

## Customization

### Adding New Question Types

1. Update the `Question` type in components
2. Add case in `QuestionRenderer`
3. Update database schema if needed
4. Add validation in `createSchema`

### Styling

All components use Tailwind CSS and shadcn/ui components. Customize by:
- Modifying Tailwind classes
- Updating shadcn/ui theme
- Adding custom animations in Framer Motion

## API Functions

```typescript
// Get all active surveys
const surveys = await surveysClient.getActiveSurveys();

// Get survey with sections and questions
const survey = await surveysClient.getSurveyWithSections(surveyId);

// Create a response session
const response = await surveysClient.createResponse(surveyId, userId);

// Save an answer
await surveysClient.saveAnswer(responseId, questionId, answer);

// Complete the survey
await surveysClient.completeResponse(responseId);

// Get survey results
const results = await surveysClient.getSurveyResults(surveyId);
```

## Best Practices

1. **Question Order**: Use sequential numbering for `section_order` and `question_order`
2. **Path Naming**: Use descriptive path names like 'developer-section', 'advanced-questions'
3. **Validation**: Always validate required fields
4. **Progress Tracking**: The system automatically tracks progress
5. **Anonymous Users**: Support both authenticated and anonymous responses

## Troubleshooting

### Common Issues

1. **Survey not showing**: Check if status is 'active' in database
2. **Navigation issues**: Verify path names match between options and sections
3. **Validation errors**: Ensure required fields are properly marked
4. **RLS errors**: Check Row Level Security policies

### Development Tips

- Use mock data for testing (already included in components)
- Test different flow paths thoroughly
- Monitor Supabase logs for database errors
- Use browser DevTools to debug form state

## Future Enhancements

- [ ] Conditional questions (show/hide based on previous answers)
- [ ] File upload questions
- [ ] Rating/scale questions
- [ ] Survey templates
- [ ] Export results to CSV
- [ ] A/B testing support
- [ ] Multi-language surveys