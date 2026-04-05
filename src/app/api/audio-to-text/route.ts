import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { user } = getInfo(request);
    formData.append('user', user);
    // Next.js sets the boundary itself usually, but dify-client wants user
    const res = await client.audioToText(formData, user);
    return NextResponse.json(res.data);
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
