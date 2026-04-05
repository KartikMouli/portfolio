import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { client, getInfo } from '@/app/api/utils/common';
import { validateFileUpload } from '@/lib/validation/chatbot';
import type { AppParams } from '@/types/app';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const { user } = getInfo(request);
    formData.append('user', user);

    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'A file is required for upload' },
        { status: 400 }
      );
    }

    const appParamsRes = await client.getApplicationParameters(user);
    const appParams = appParamsRes.data as unknown as AppParams;
    const validation = validateFileUpload(file, appParams.file_upload, 0);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const res = await (
      client.fileUpload as unknown as (
        form: FormData,
        user: string
      ) => Promise<{ data: unknown }>
    )(formData, user);
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
