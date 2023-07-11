import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { Database } from '@/types_db';
import type { NextRequest } from 'next/server';

import createIntlMiddleware from 'next-intl/middleware';

// export default createMiddleware({
//   // A list of all locales that are supported
//   locales: ['en', 'de'],
//   // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
//   defaultLocale: 'en'
// });

export const config = {
  // Skip all paths that should not be internationalized. This example skips the
  // folders "api", "_next" and all files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)']
};

export async function middleware(req: NextRequest) {
  console.log('req,', '*****************Hi from midelware*******************');
  const defaultLocale = req.headers.get('x-default-locale') || 'en';
  const handleI18nRouting = createIntlMiddleware({
    locales: ['en', 'de'],
    defaultLocale: 'en'
  });
  const res = handleI18nRouting(req);
  res.headers.set('x-default-locale', 'en');

  //const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  return res;
}
