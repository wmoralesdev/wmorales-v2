import type { ZodError } from "zod";
import { type Presentation, presentationSchema } from "./schema";

/**
 * Result of validating a presentation JSON.
 */
export type ValidationResult =
  | { success: true; data: Presentation }
  | { success: false; errors: ValidationError[] };

/**
 * A single validation error with path and message.
 */
export type ValidationError = {
  path: string;
  message: string;
};

/**
 * Transform Zod errors into a flat list of validation errors.
 */
function formatZodErrors(error: ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    path: err.path.join(".") || "root",
    message: err.message,
  }));
}

/**
 * Additional validation rules that can't be expressed in Zod's discriminatedUnion.
 * Returns additional errors for mutual exclusivity checks.
 */
function validateMutualExclusivity(data: Presentation): ValidationError[] {
  const errors: ValidationError[] = [];

  data.slides.forEach((slide, index) => {
    const path = `slides.${index}`;

    // Statement slide: body XOR items
    if (slide.type === "statement") {
      const hasBody = slide.body !== undefined && slide.body !== null;
      const hasItems = slide.items !== undefined && slide.items.length > 0;
      if (hasBody && hasItems) {
        errors.push({
          path,
          message:
            "Statement slide cannot have both 'body' and 'items'. Use one or neither.",
        });
      }
    }

    // Cards slide: each card's description XOR items
    if (slide.type === "cards") {
      slide.cards.forEach((card, cardIndex) => {
        const hasDescription =
          card.description !== undefined && card.description !== "";
        const hasItems = card.items !== undefined && card.items.length > 0;
        if (hasDescription && hasItems) {
          errors.push({
            path: `${path}.cards.${cardIndex}`,
            message:
              "Card cannot have both 'description' and 'items'. Use one or neither.",
          });
        }
      });
    }
  });

  return errors;
}

/**
 * Validate a presentation JSON object against the schema.
 * Returns a discriminated union with either the validated data or a list of errors.
 */
export function validatePresentation(data: unknown): ValidationResult {
  const result = presentationSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: formatZodErrors(result.error),
    };
  }

  // Additional validation for mutual exclusivity
  const additionalErrors = validateMutualExclusivity(result.data);
  if (additionalErrors.length > 0) {
    return {
      success: false,
      errors: additionalErrors,
    };
  }

  return { success: true, data: result.data };
}

/**
 * Validate a presentation JSON string.
 * Handles JSON parsing errors as well as schema validation errors.
 */
export function validatePresentationJSON(json: string): ValidationResult {
  let data: unknown;

  try {
    data = JSON.parse(json);
  } catch (parseError) {
    return {
      success: false,
      errors: [
        {
          path: "root",
          message: `Invalid JSON: ${parseError instanceof Error ? parseError.message : "Unknown parse error"}`,
        },
      ],
    };
  }

  return validatePresentation(data);
}

/**
 * Type guard to check if a validation result is successful.
 */
export function isValidPresentation(
  result: ValidationResult,
): result is { success: true; data: Presentation } {
  return result.success;
}

/**
 * Format validation errors for display (e.g., in UI or logs).
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map((err) => `[${err.path}] ${err.message}`).join("\n");
}
