# 🗄️ I18n Database Migration Guide

## 📋 Migration Overview

This migration adds internationalization support to the database using a hybrid approach:
- **Language-specific content**: Surveys, Polls (separate instances per language)
- **Shared interaction with localized content**: Events (EventContent model)
- **Fully shared**: Guestbook (no changes needed)

## 🔧 Required Migration Commands

### 1. Generate Migration
```bash
pnpm prisma migrate dev --name "add_i18n_support"
```

### 2. Apply Migration (if needed)
```bash
pnpm prisma db push
```

## 📊 Schema Changes Summary

### ✅ Language-Specific Models (Add `language` column)

#### Surveys
- `surveys.language` VARCHAR(2) DEFAULT 'en'
- `survey_sections.language` VARCHAR(2) DEFAULT 'en'
- `survey_questions.language` VARCHAR(2) DEFAULT 'en'
- `survey_question_options.language` VARCHAR(2) DEFAULT 'en'

#### Polls  
- `polls.language` VARCHAR(2) DEFAULT 'en'
- `poll_questions.language` VARCHAR(2) DEFAULT 'en'
- `poll_options.language` VARCHAR(2) DEFAULT 'en'

### 🔄 Events (Hybrid Approach)

#### Existing `events` table changes:
- Add `slug` VARCHAR UNIQUE (SEO-friendly URLs)
- Remove `title` and `description` columns (moved to EventContent)

#### New `event_content` table:
```sql
CREATE TABLE event_content (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  language VARCHAR(2) NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  UNIQUE(event_id, language)
);
```

### 🔄 Indices Added
```sql
-- Language filtering indices
CREATE INDEX idx_surveys_language ON surveys(language);
CREATE INDEX idx_survey_sections_language ON survey_sections(language);
CREATE INDEX idx_survey_questions_language ON survey_questions(language);
CREATE INDEX idx_survey_question_options_language ON survey_question_options(language);

CREATE INDEX idx_polls_language ON polls(language);
CREATE INDEX idx_poll_questions_language ON poll_questions(language);
CREATE INDEX idx_poll_options_language ON poll_options(language);

-- Event indices
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_event_content_event_id ON event_content(event_id);
CREATE INDEX idx_event_content_language ON event_content(language);
```

## 📋 Data Migration Strategy

### 1. Default Language Assignment
All existing records will default to English ('en'):
```sql
-- This happens automatically with DEFAULT 'en' constraint
UPDATE surveys SET language = 'en' WHERE language IS NULL;
UPDATE polls SET language = 'en' WHERE language IS NULL;
-- etc.
```

### 2. Event Content Migration
Existing event title/description needs to be moved to event_content:
```sql
-- This would be handled by the migration
INSERT INTO event_content (event_id, language, title, description)
SELECT id, 'en', title, description 
FROM events 
WHERE title IS NOT NULL;
```

### 3. Slug Generation for Events
```sql
-- Generate slugs from existing titles (example)
UPDATE events SET slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;
```

## 🧪 Testing Migration

### Before Migration
```bash
# Test current schema
pnpm prisma db pull
pnpm prisma generate
```

### After Migration
```bash
# Verify migration applied
pnpm prisma migrate status
pnpm prisma generate

# Test queries work
npx prisma studio
```

## 🔙 Rollback Plan

If migration needs to be rolled back:
```bash
# Reset database to previous migration
pnpm prisma migrate reset
```

## ⚠️ Important Notes

1. **Backup First**: Always backup production database before migration
2. **Existing Data**: All existing content will default to English
3. **Application Updates**: Code changes needed to use new schema
4. **Testing**: Test thoroughly in development before production
5. **Downtime**: Brief downtime expected during migration

## 🎯 Expected Outcome

After migration:
- ✅ Surveys/Polls can be created in EN/ES separately
- ✅ Events have localized content but shared galleries
- ✅ Guestbook remains fully shared community
- ✅ All type definitions updated
- ✅ Ready for Phase 3 (Route Structure Implementation)

---

**Status**: Ready to execute when database is accessible