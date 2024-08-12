import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { Routes } from '@/src/shared/routes';
import { JWT_TOKEN_KEY } from '@/src/shared/constants';

const loggedInRoutes = [
  Routes.client.settings,
  Routes.client.articles.create,
  '/articles/edit',
];
const loggedOutRoutes = [Routes.client.signIn, Routes.client.signUp];

export default async function AuthMiddleware(
  req: NextRequest,
): Promise<NextResponse> {
  if (
    !loggedInRoutes.some((path) => req.nextUrl.pathname.startsWith(path)) &&
    !loggedOutRoutes.some((path) => req.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.next();
  } else {
    const myCookie = cookies();

    let token: string | null = null;
    if (myCookie.get(JWT_TOKEN_KEY)) {
      token = myCookie.get(JWT_TOKEN_KEY)!.value;
    }

    if (
      !token &&
      loggedInRoutes.some((path) => req.nextUrl.pathname.startsWith(path))
    ) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}${Routes.client.signIn}`,
      );
    } else if (
      token &&
      loggedOutRoutes.some((path) => req.nextUrl.pathname.startsWith(path))
    ) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_LOCAL_DOMAIN}`);
    }
  }

  return NextResponse.next();
}
