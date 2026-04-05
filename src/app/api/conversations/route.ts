import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo, setSession } from '@/app/api/utils/common';

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request);
  try {
    const { data }: { data: unknown } = await client.getConversations(user);
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    });
  } catch (error: unknown) {
    return NextResponse.json({
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
