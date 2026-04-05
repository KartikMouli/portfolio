import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo, setSession } from '@/app/api/utils/common';

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request);
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversation_id');

  if (!conversationId || conversationId.trim().length === 0) {
    return NextResponse.json(
      { error: 'conversation_id is required' },
      { status: 400, headers: setSession(sessionId) }
    );
  }

  const { data }: { data: unknown } = await client.getConversationMessages(
    user,
    conversationId
  );
  return NextResponse.json(data, {
    headers: setSession(sessionId),
  });
}
