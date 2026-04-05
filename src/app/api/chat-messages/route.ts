import type { NextRequest } from 'next/server';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';
import { chatMessageSchema } from '@/lib/validation/chatbot';

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
    const rawBody = await request.json();
    const result = chatMessageSchema.safeParse(rawBody);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      inputs,
      query,
      files,
      conversation_id: conversationId,
      response_mode: responseMode,
    } = result.data;
    const { user } = getInfo(request);
    const res = await client.createChatMessage(
      inputs,
      query,
      user,
      responseMode === 'streaming',
      conversationId,
      files
    );

    if (isStreamResponse(res)) {
      return new Response(Readable.toWeb(res.toReadable()) as BodyInit, {
        status: res.status,
        headers: new Headers(res.headers),
      });
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
