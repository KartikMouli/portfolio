// This file replaces middleware.ts in Next.js 16
import { NextResponse } from 'next/server';

export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
