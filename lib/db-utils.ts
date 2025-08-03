// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from './prisma';

type RetryOptions = {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
};

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10_000, // 10 seconds
};

/**
 * Calculates exponential backoff delay
 */
function calculateDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number
): number {
  return Math.min(baseDelay * 2 ** attempt, maxDelay);
}

/**
 * Logs retry attempt in development mode
 */
function logRetryAttempt(
  attempt: number,
  maxRetries: number,
  delay: number,
  error: unknown
): void {
  if (process.env.NODE_ENV === 'development') {
    // biome-ignore lint/suspicious/noConsole: Development logging for database retries
    console.warn(
      `Database operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`,
      {
        error: error instanceof Error ? error.message : String(error),
      }
    );
  }
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof PrismaClientKnownRequestError) {
    // P1001: Can't reach database server
    // P1008: Operations timed out
    // P1017: Server has closed the connection
    return ['P1001', 'P1008', 'P1017'].includes(error.code);
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('econnrefused') ||
      message.includes('enotfound') ||
      message.includes('server has closed')
    );
  }

  return false;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Internal recursive retry function to avoid await-in-loop
 */
async function attemptOperation<T>(
  operation: () => Promise<T>,
  attempt: number,
  maxRetries: number,
  baseDelay: number,
  maxDelay: number
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const shouldRetry = isRetryableError(error) && attempt < maxRetries;

    if (shouldRetry) {
      const delay = calculateDelay(attempt, baseDelay, maxDelay);
      logRetryAttempt(attempt, maxRetries, delay, error);
      await sleep(delay);
      return attemptOperation(
        operation,
        attempt + 1,
        maxRetries,
        baseDelay,
        maxDelay
      );
    }

    throw error;
  }
}

/**
 * Executes a database operation with exponential backoff retry logic
 */
export function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, baseDelay, maxDelay } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  return attemptOperation(operation, 0, maxRetries, baseDelay, maxDelay);
}

/**
 * Enhanced Prisma client with automatic retries
 */
export const db = {
  // Wrap common Prisma operations with retry logic
  query<T>(
    operation: () => Promise<T>,
    retryOptions?: RetryOptions
  ): Promise<T> {
    return withRetry(operation, retryOptions);
  },

  // Quick access to Prisma client for operations that don't need retries
  get client() {
    return prisma;
  },

  // Health check function
  async healthCheck(): Promise<boolean> {
    try {
      await withRetry(() => prisma.$queryRaw`SELECT 1`, {
        maxRetries: 1,
        baseDelay: 500,
      });
      return true;
    } catch {
      return false;
    }
  },

  // Connection info
  async getConnectionInfo() {
    try {
      const result = await withRetry(
        () =>
          prisma.$queryRaw<
            Array<{
              current_database: string;
              current_user: string;
              version: string;
            }>
          >`
          SELECT current_database(), current_user, version()
        `,
        { maxRetries: 1 }
      );
      return result[0];
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        // biome-ignore lint/suspicious/noConsole: Development logging for connection diagnostics
        console.error('Failed to get connection info:', error);
      }
      return null;
    }
  },
};

export { prisma } from './prisma';
