import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { JWT_TOKEN_KEY } from '@/src/shared/constants';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    token: request.cookies.get(JWT_TOKEN_KEY)?.value,
  });
}
