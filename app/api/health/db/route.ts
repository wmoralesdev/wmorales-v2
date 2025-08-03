import { NextResponse } from 'next/server';
import { db } from '@/lib/db-utils';

export async function GET() {
  try {
    const start = Date.now();
    const isHealthy = await db.healthCheck();
    const duration = Date.now() - start;

    if (!isHealthy) {
      return NextResponse.json(
        { status: 'unhealthy', duration },
        { status: 503 }
      );
    }

    const connectionInfo = await db.getConnectionInfo();

    return NextResponse.json({
      status: 'healthy',
      duration,
      connectionInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
