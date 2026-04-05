import type { NextRequest } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user } = getInfo(request);

    // According to dify docs, we can pass text, message_id etc.
    const requestPayload = {
      user,
      text: body.text,
      message_id: body.message_id,
      streaming: false,
      voice: body.voice || 'english',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await client.textToAudio(requestPayload);
    // res should be a DifyResponse<Buffer> or stream
    // Since we didn't specify streaming, it's likely a buffer.

    // Send it back as Audio content
    return new Response(res.data || res, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (e: unknown) {
    return new Response(e instanceof Error ? e.message : 'Unknown error', {
      status: 500,
    });
  }
}
