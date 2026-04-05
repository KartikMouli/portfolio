import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo, setSession } from '@/app/api/utils/common';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ messageId: string }>;
  }
) {
  const { messageId } = await params;
  const { sessionId, user } = getInfo(request);
  const sessionHeaders = setSession(sessionId);

  try {
    const { data } = await client.getSuggested(messageId, user);
    return NextResponse.json(data, {
      headers: sessionHeaders,
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch suggested questions' },
      { status: 500, headers: sessionHeaders }
    );
  }
}
