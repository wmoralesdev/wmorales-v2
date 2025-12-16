import { prisma } from "./prisma";

export const db = {
  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },

  async getConnectionInfo(): Promise<{
    connected: boolean;
    database?: string;
    provider?: string;
  }> {
    try {
      const result = await prisma.$queryRaw<
        Array<{ current_database: string }>
      >`
        SELECT current_database();
      `;
      return {
        connected: true,
        database: result[0]?.current_database,
        provider: "postgresql",
      };
    } catch {
      return {
        connected: false,
      };
    }
  },
};
