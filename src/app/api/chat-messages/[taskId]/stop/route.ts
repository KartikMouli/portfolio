import type { NextRequest } from 'next/server';
import { getInfo, client } from '@/app/api/utils/common';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { user } = getInfo(request);
  const { taskId } = await params;

  try {
    const res = await client.stopMessage(taskId, user);

    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
