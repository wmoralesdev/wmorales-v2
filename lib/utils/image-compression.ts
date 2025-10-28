import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
  quality?: number;
}

/**
 * Determines compression settings based on image file size and dimensions
 * Returns appropriate compression options for different image qualities
 */
export function getCompressionOptions(file: File): CompressionOptions {
  const fileSizeMB = file.size / (1024 * 1024);

  // For smaller images (< 2MB), apply minimal compression
  if (fileSizeMB < 2) {
    return {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 2048, // Near original for most phone cameras
      useWebWorker: true,
      quality: 0.9,
    };
  }

  // For medium images (2-5MB), apply moderate compression
  if (fileSizeMB < 5) {
    return {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920, // Full HD resolution
      useWebWorker: true,
      quality: 0.85,
    };
  }

  // For large images (5-10MB), apply more compression
  if (fileSizeMB < 10) {
    return {
      maxSizeMB: 3,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8,
    };
  }

  // For very large images (>10MB), apply maximum compression
  return {
    maxSizeMB: 4,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    quality: 0.75,
  };
}

/**
 * Compresses an image file using browser-image-compression
 * @param file - The image file to compress
 * @param customOptions - Optional custom compression options
 * @returns Promise<File> - The compressed image file
 */
export async function compressImage(
  file: File,
  customOptions?: Partial<CompressionOptions>
): Promise<File> {
  // Get default options based on file characteristics
  const defaultOptions = getCompressionOptions(file);

  // Merge with custom options if provided
  const options = {
    ...defaultOptions,
    ...customOptions,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Batch compress multiple image files
 * @param files - Array of image files to compress
 * @param onProgress - Optional callback for progress updates
 * @returns Promise<File[]> - Array of compressed image files
 */
export async function batchCompressImages(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<File[]> {
  const compressedFiles: File[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const compressedFile = await compressImage(files[i]);
      compressedFiles.push(compressedFile);

      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    } catch (error) {
      console.error(`Failed to compress ${files[i].name}:`, error);
      // Add original file if compression fails
      compressedFiles.push(files[i]);
    }
  }

  return compressedFiles;
}

/**
 * Validates if a file is an image that can be compressed
 * @param file - The file to validate
 * @returns boolean - True if file is a valid image
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
  ];
  return validTypes.includes(file.type.toLowerCase());
}

/**
 * Gets human-readable file size
 * @param bytes - File size in bytes
 * @returns string - Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / k ** i).toFixed(2)) + " " + sizes[i];
}
