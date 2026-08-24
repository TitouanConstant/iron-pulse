import { NextResponse } from 'next/server';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // If Supabase auth code exchange is handled via redirect
    return NextResponse.redirect(`${origin}${next}`);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${next}`);
}
