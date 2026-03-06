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
  chipLabel: 32,
  timelineEvents: 4,
  cardsMin: 2,
  cardsMax: 4,
  credentialGroupItems: 4,
  credentialGroups: 3,
  columnItems: 4,
  ctaSteps: 4,
  visibleResources: 5,
  brandMarks: 3,
  chips: 8,
  promptTitle: 80,
  prompt: 6000,
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

const resourceSchema = z.object({
  label: z.string().min(1, "Resource label is required"),
  url: z.string().url("Resource URL must be a valid URL"),
});

const visibleResourceSchema = resourceSchema.extend({
  kind: z.enum(["default", "event", "photos", "community"]).optional(),
});

const brandMarkSchema = z.object({
  src: z.string().min(1, "Brand mark src is required"),
  lightSrc: z.string().optional(),
  darkSrc: z.string().optional(),
  alt: z.string().min(1, "Brand mark alt is required"),
  href: z.string().url("Brand mark href must be a valid URL").optional(),
  label: z.string().optional(),
  size: z.enum(["sm", "md", "lg", "xl"]).optional(),
});

const chipSchema = z
  .string()
  .min(1, "Chip label is required")
  .max(
    TEXT_LIMITS.chipLabel,
    `Chip label must be ${TEXT_LIMITS.chipLabel} characters or less`,
  );

export const slideExtrasSchema = z.object({
  footnotes: z.array(z.string()).optional(),
  resources: z.array(resourceSchema).optional(),
  visibleResources: z
    .array(visibleResourceSchema)
    .max(
      TEXT_LIMITS.visibleResources,
      `Visible resources must be ${TEXT_LIMITS.visibleResources} or less`,
    )
    .optional(),
  brandMarks: z
    .array(brandMarkSchema)
    .max(
      TEXT_LIMITS.brandMarks,
      `Brand marks must be ${TEXT_LIMITS.brandMarks} or less`,
    )
    .optional(),
  chips: z
    .array(chipSchema)
    .max(TEXT_LIMITS.chips, `Chips must be ${TEXT_LIMITS.chips} or less`)
    .optional(),
});

export type SlideExtras = z.infer<typeof slideExtrasSchema>;
export type SlideResource = z.infer<typeof resourceSchema>;
export type SlideVisibleResource = z.infer<typeof visibleResourceSchema>;
export type SlideBrandMark = z.infer<typeof brandMarkSchema>;

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
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
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

export type CoverSlide = z.infer<typeof coverSlideSchema> & SlideExtras;

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

export type StatementSlide = z.infer<typeof statementSlideSchema> & SlideExtras;

// =============================================================================
// Slide: Bullets
// =============================================================================

export const bulletsSlideSchema = z.object({
  type: z.literal("bullets"),
  headline: headlineSchema,
  items: itemsArraySchema.min(1, "Bullets slide requires at least one item"),
  footnote: z.string().optional(),
});

export type BulletsSlide = z.infer<typeof bulletsSlideSchema> & SlideExtras;

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

export type ProfileSlide = z.infer<typeof profileSlideSchema> & SlideExtras;

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

export type TimelineSlide = z.infer<typeof timelineSlideSchema> & SlideExtras;

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

export type CardsSlide = z.infer<typeof cardsSlideSchema> & SlideExtras;

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

export type TwoColumnSlide = z.infer<typeof twoColumnSlideSchema> & SlideExtras;

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

export type CtaSlide = z.infer<typeof ctaSlideSchema> & SlideExtras;

// =============================================================================
// Slide: Prompt
// =============================================================================

export const promptSlideSchema = z.object({
  type: z.literal("prompt"),
  headline: headlineSchema,
  title: z
    .string()
    .max(
      TEXT_LIMITS.promptTitle,
      `Prompt title must be ${TEXT_LIMITS.promptTitle} characters or less`,
    )
    .optional(),
  prompt: z
    .string()
    .max(
      TEXT_LIMITS.prompt,
      `Prompt must be ${TEXT_LIMITS.prompt} characters or less`,
    ),
  footnote: z.string().optional(),
});

export type PromptSlide = z.infer<typeof promptSlideSchema> & SlideExtras;

// =============================================================================
// Discriminated union of all slide types
// =============================================================================

export const slideSchema = z.discriminatedUnion("type", [
  coverSlideSchema.merge(slideExtrasSchema),
  statementSlideSchema.merge(slideExtrasSchema),
  bulletsSlideSchema.merge(slideExtrasSchema),
  profileSlideSchema.merge(slideExtrasSchema),
  timelineSlideSchema.merge(slideExtrasSchema),
  cardsSlideSchema.merge(slideExtrasSchema),
  twoColumnSlideSchema.merge(slideExtrasSchema),
  ctaSlideSchema.merge(slideExtrasSchema),
  promptSlideSchema.merge(slideExtrasSchema),
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
