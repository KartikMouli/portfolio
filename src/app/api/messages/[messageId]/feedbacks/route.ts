import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ messageId: string }>;
  }
) {
  try {
    const body = await request.json();
    const { rating } = body;
    const { messageId } = await params;
    const { user } = getInfo(request);
    const { data } = await client.messageFeedback(messageId, rating, user);
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : 'Failed to submit feedback',
      },
      { status: 500 }
    );
  }
}
