// import { getServerSession } from 'next-auth/next';
// import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function checkAuth() {
  // Bearer Token Check, only when enabled
//   if (ApiToken) {
//     const headersList = headers();
//     const authorization = headersList.get('authorization');
//     if (authorization) {
//       if (authorization !== `Bearer ${ApiToken}`) return NextResponse.json({ status: 0 }, { status: 401 });
//       return;
//     }
//   }
//   // Session Check
//   const session = await getServerSession(authOptions);
//   if (!session) return NextResponse.json({ status: 0 }, { status: 401 });
//   if ((session.user as { [k: string]: string })?.[AdminType] !== AdminId)
//     return NextResponse.json({ status: 0 }, { status: 403 });
}

export function defaultHandler() {
  return NextResponse.json({ status: 404 }, { status: 404 });
}

export function catchServerError<T = any>(defaultValue: T) {
  return (e: Error) => {
    console.error(e);
    return defaultValue;
  };
}

export type ApiContextParams = { params: { [k: string]: string } };