import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { user } = getInfo(request);
    formData.append('user', user);
    const res = await client.fileUpload(formData, user);
    return NextResponse.json(res.data);
  } catch (e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = e as any;
    if (err.response && err.response.data) {
      return NextResponse.json(
        { error: err.response.data.message || err.response.data.code },
        { status: err.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
