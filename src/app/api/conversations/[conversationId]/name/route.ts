import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

export async function POST(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ conversationId: string }>;
  }
) {
  try {
    const body = await request.json();
    const { auto_generate, name } = body;
    const { conversationId } = await params;
    const { user } = getInfo(request);

    // auto generate name
    const { data } = await client.renameConversation(
      conversationId,
      name,
      user,
      auto_generate
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Failed to rename conversation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
