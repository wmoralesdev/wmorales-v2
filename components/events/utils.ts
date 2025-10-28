import { toast } from "sonner";
import type { ExtendedEventImage } from "@/lib/types/event.types";

// Sort images by creation date (newest first)
export function sortImagesByDate(
  images: ExtendedEventImage[]
): ExtendedEventImage[] {
  return [...images].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Group images by upload date for timeline view
export function groupImagesByDate(
  images: ExtendedEventImage[],
  locale: string
): Record<string, ExtendedEventImage[]> {
  return images.reduce(
    (acc, image) => {
      const date = new Date(image.createdAt).toLocaleDateString(locale);
      if (!acc[date]) acc[date] = [];
      acc[date].push(image);
      return acc;
    },
    {} as Record<string, ExtendedEventImage[]>
  );
}

// Get unique contributors count
export function getUniqueContributorsCount(
  images: ExtendedEventImage[]
): number {
  return new Set(images.map((img) => img.profileId)).size;
}

// Handle share functionality
export async function handleShareEvent(
  eventSlug: string,
  eventTitle: string,
  eventDescription?: string | null,
  sharePrompt = "Check out event photos"
): Promise<void> {
  const eventUrl = `${window.location.origin}/events/${eventSlug}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: eventTitle,
        text: eventDescription || sharePrompt,
        url: eventUrl,
      });
    } catch (err) {
      // User cancelled share, do nothing
    }
  } else {
    navigator.clipboard.writeText(eventUrl);
    toast.success("Link copied");
  }
}

// Get event URL for sharing/QR code
export function getEventUrl(eventSlug: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/events/${eventSlug}`;
  }
  return "";
}

// Check if event has ended
export function isEventEnded(endsAt: Date | null): boolean {
  return endsAt ? new Date() > endsAt : false;
}

// Validate image file
export function validateImageFile(
  file: File,
  maxSizeMB = 10
): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "File must be an image" };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

// Create file preview URL
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      resolve(url);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
