import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { client, getInfo, setSession } from '@/app/api/utils/common';

const getCachedParameters = unstable_cache(
  async (user: string) => {
    const { data } = await client.getApplicationParameters(user);
    return data as object;
  },
  ['dify-app-parameters'],
  { revalidate: 3600 } // cache for 1 hour
);

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request);
  try {
    const data = await getCachedParameters(user);
    return NextResponse.json(data, {
      headers: setSession(sessionId),
    });
  } catch (_error) {
    return NextResponse.json([]);
  }
}
