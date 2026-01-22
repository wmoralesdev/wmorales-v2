// Schema and types

// File system
export {
  type DeckMeta,
  getDeckPath,
  getSlidesDir,
  type LoadDeckResult,
  listDeckSlugs,
  listDecks,
  loadDeck,
  loadDeckRaw,
  slidesDirExists,
} from "./fs";
export {
  type BulletsSlide,
  bulletsSlideSchema,
  type CardsSlide,
  type CoverSlide,
  type CtaSlide,
  cardsSlideSchema,
  coverSlideSchema,
  ctaSlideSchema,
  type Presentation,
  type PresentationMeta,
  type ProfileSlide,
  presentationMetaSchema,
  presentationSchema,
  profileSlideSchema,
  type Slide,
  type StatementSlide,
  slideSchema,
  statementSlideSchema,
  TEXT_LIMITS,
  type TimelineSlide,
  type TwoColumnSlide,
  timelineSlideSchema,
  twoColumnSlideSchema,
} from "./schema";

// Theme
export {
  generateSlideTheme,
  type SlideThemeTokens,
  themeTokensToCSSProperties,
  themeTokensToStyle,
} from "./theme";
// Validation
export {
  formatValidationErrors,
  isValidPresentation,
  type ValidationError,
  type ValidationResult,
  validatePresentation,
  validatePresentationJSON,
} from "./validate";
