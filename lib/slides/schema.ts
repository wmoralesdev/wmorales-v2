import { z } from "zod";

// =============================================================================
// Text limit constants from spec
// =============================================================================

const TEXT_LIMITS = {
  headline: 60,
  body: 200,
  description: 120,
  itemsArray: 5,
  itemString: 80,
  timelineEvents: 4,
  cardsMin: 2,
  cardsMax: 4,
  credentialGroupItems: 4,
  credentialGroups: 3,
  columnItems: 4,
  ctaSteps: 4,
} as const;

// =============================================================================
// Shared schemas
// =============================================================================

/**
 * Hex color validation (e.g., "#FF6B35")
 */
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g., #FF6B35)");

/**
 * Headline text with max length
 */
const headlineSchema = z
  .string()
  .max(
    TEXT_LIMITS.headline,
    `Headline must be ${TEXT_LIMITS.headline} characters or less`,
  );

/**
 * Body text with max length
 */
const bodySchema = z
  .string()
  .max(TEXT_LIMITS.body, `Body must be ${TEXT_LIMITS.body} characters or less`);

/**
 * Description text with max length
 */
const descriptionSchema = z
  .string()
  .max(
    TEXT_LIMITS.description,
    `Description must be ${TEXT_LIMITS.description} characters or less`,
  );

/**
 * Item string with max length
 */
const itemStringSchema = z
  .string()
  .max(
    TEXT_LIMITS.itemString,
    `Item must be ${TEXT_LIMITS.itemString} characters or less`,
  );

/**
 * Items array with max count
 */
const itemsArraySchema = z
  .array(itemStringSchema)
  .max(
    TEXT_LIMITS.itemsArray,
    `Items array must have ${TEXT_LIMITS.itemsArray} items or less`,
  );

// =============================================================================
// Presentation Meta
// =============================================================================

const seoSchema = z.object({
  title: z
    .string()
    .max(60, "SEO title should be 60 characters or less")
    .optional(),
  description: z
    .string()
    .max(160, "SEO description should be 160 characters or less")
    .optional(),
  image: z.string().url("SEO image must be a valid URL").optional(),
});

export const presentationMetaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  theme: z.enum(["dark", "light"]),
  accentColor: hexColorSchema,
  language: z.string().optional(),
  seo: seoSchema.optional(),
});

export type PresentationMeta = z.infer<typeof presentationMetaSchema>;

// =============================================================================
// Slide: Cover
// =============================================================================

export const coverSlideSchema = z.object({
  type: z.literal("cover"),
  headline: headlineSchema,
  subline: z.string(),
  author: z.object({
    name: z.string(),
    title: z.string(),
  }),
  logos: z.array(z.string()).optional(),
});

export type CoverSlide = z.infer<typeof coverSlideSchema>;

// =============================================================================
// Slide: Statement
// =============================================================================

const breakdownItemSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const statementSlideSchema = z.object({
  type: z.literal("statement"),
  headline: headlineSchema,
  body: bodySchema.nullable().optional(),
  items: itemsArraySchema.optional(),
  breakdown: z.array(breakdownItemSchema).optional(),
  quote: z.string().optional(),
  footnote: z.string().optional(),
});

export type StatementSlide = z.infer<typeof statementSlideSchema>;

// =============================================================================
// Slide: Bullets
// =============================================================================

export const bulletsSlideSchema = z.object({
  type: z.literal("bullets"),
  headline: headlineSchema,
  items: itemsArraySchema.min(1, "Bullets slide requires at least one item"),
  footnote: z.string().optional(),
});

export type BulletsSlide = z.infer<typeof bulletsSlideSchema>;

// =============================================================================
// Slide: Profile
// =============================================================================

const credentialGroupSchema = z.object({
  category: z.string(),
  items: z
    .array(z.string())
    .max(
      TEXT_LIMITS.credentialGroupItems,
      `Credential group items must be ${TEXT_LIMITS.credentialGroupItems} or less`,
    ),
});

export const profileSlideSchema = z.object({
  type: z.literal("profile"),
  headline: headlineSchema,
  subtitle: z.string(),
  bio: bodySchema,
  credentials: z
    .array(credentialGroupSchema)
    .max(
      TEXT_LIMITS.credentialGroups,
      `Max ${TEXT_LIMITS.credentialGroups} credential groups recommended`,
    ),
  image: z.string().optional(),
});

export type ProfileSlide = z.infer<typeof profileSlideSchema>;

// =============================================================================
// Slide: Timeline
// =============================================================================

const timelineEventSchema = z.object({
  title: z.string(),
  description: descriptionSchema,
  metric: z.string().optional(),
});

export const timelineSlideSchema = z.object({
  type: z.literal("timeline"),
  headline: headlineSchema,
  events: z
    .array(timelineEventSchema)
    .min(1, "Timeline requires at least one event")
    .max(
      TEXT_LIMITS.timelineEvents,
      `Max ${TEXT_LIMITS.timelineEvents} timeline events recommended`,
    ),
});

export type TimelineSlide = z.infer<typeof timelineSlideSchema>;

// =============================================================================
// Slide: Cards
// =============================================================================

const cardSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: descriptionSchema.optional(),
  items: z.array(z.string()).optional(),
});

export const cardsSlideSchema = z.object({
  type: z.literal("cards"),
  headline: headlineSchema,
  cards: z
    .array(cardSchema)
    .min(
      TEXT_LIMITS.cardsMin,
      `Cards slide requires at least ${TEXT_LIMITS.cardsMin} cards`,
    )
    .max(
      TEXT_LIMITS.cardsMax,
      `Cards slide allows max ${TEXT_LIMITS.cardsMax} cards`,
    ),
  footnote: z.string().optional(),
});

export type CardsSlide = z.infer<typeof cardsSlideSchema>;

// =============================================================================
// Slide: Two-Column
// =============================================================================

const columnContentSchema = z.object({
  title: z.string(),
  items: z
    .array(itemStringSchema)
    .max(
      TEXT_LIMITS.columnItems,
      `Column items must be ${TEXT_LIMITS.columnItems} or less`,
    ),
});

export const twoColumnSlideSchema = z.object({
  type: z.literal("two-column"),
  headline: headlineSchema,
  left: columnContentSchema,
  right: columnContentSchema,
});

export type TwoColumnSlide = z.infer<typeof twoColumnSlideSchema>;

// =============================================================================
// Slide: CTA (Call-to-Action)
// =============================================================================

const contactInfoSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Must be a valid email address"),
  website: z.string().url("Must be a valid URL").optional(),
  phone: z.string().optional(),
});

const qrSchema = z.object({
  url: z.string().url("QR url must be a valid URL"),
  label: z.string().optional(),
});

export const ctaSlideSchema = z.object({
  type: z.literal("cta"),
  headline: headlineSchema,
  steps: z
    .array(itemStringSchema)
    .max(
      TEXT_LIMITS.ctaSteps,
      `CTA steps must be ${TEXT_LIMITS.ctaSteps} or less`,
    ),
  contact: contactInfoSchema,
  qr: qrSchema.optional(),
});

export type CtaSlide = z.infer<typeof ctaSlideSchema>;

// =============================================================================
// Discriminated union of all slide types
// =============================================================================

export const slideSchema = z.discriminatedUnion("type", [
  coverSlideSchema,
  statementSlideSchema,
  bulletsSlideSchema,
  profileSlideSchema,
  timelineSlideSchema,
  cardsSlideSchema,
  twoColumnSlideSchema,
  ctaSlideSchema,
]);

export type Slide = z.infer<typeof slideSchema>;

// =============================================================================
// Full Presentation schema
// =============================================================================

export const presentationSchema = z.object({
  meta: presentationMetaSchema,
  slides: z
    .array(slideSchema)
    .min(1, "Presentation must have at least one slide"),
});

export type Presentation = z.infer<typeof presentationSchema>;

// =============================================================================
// Export text limits for reference
// =============================================================================

export { TEXT_LIMITS };
