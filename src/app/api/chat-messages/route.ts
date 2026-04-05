import type { NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

const isStreamResponse = (
  response: unknown
): response is {
  toReadable: () => Readable;
  status: number;
  headers: Record<string, string>;
} => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'toReadable' in response &&
    typeof (response as { toReadable?: unknown }).toReadable === 'function'
  );
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      inputs,
      query,
      files,
      conversation_id: conversationId,
      response_mode: responseMode,
    } = body;
    const { user } = getInfo(request);
    const res = await client.createChatMessage(
      inputs,
      query,
      user,
      responseMode,
      conversationId,
      files
    );

    if (isStreamResponse(res)) {
      return new Response(
        Readable.toWeb(res.toReadable()) as unknown as BodyInit,
        {
          status: res.status,
          headers: new Headers(res.headers),
        }
      );
    }

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: new Headers({
        ...res.headers,
        'Content-Type': 'application/json',
      }),
    });
  } catch (error: unknown) {
    console.error('Failed to create chat message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
