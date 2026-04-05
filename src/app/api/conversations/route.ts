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
    console.error('Failed to fetch conversations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: setSession(sessionId) }
    );
  }
}
