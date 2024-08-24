// middleware.js
import { NextResponse } from 'next/server';
import { updateSession } from './utils/supabase/middleware';



export async function middleware(req) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  const { response, supabase } = await updateSession(req)
  const { data: authData, error: authError } = await supabase.auth.getUser();


  // Apply middleware only to paths starting with /admin
  if (pathname.startsWith('/admin')) {

    if (!authData.user) {
      // Redirect if there’s an error or user is not found

      return NextResponse.redirect(new URL('/access-denied', req.url));
    }

    const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('user_id', authData.user.id)
    .single()


    if (userError || !userData || userData.role !== 'admin') {
    // Redirect if user role is not admin
    return NextResponse.redirect(new URL('/access-denied', req.url));
    }

  }

  // Allow the request to continue if authenticated and authorized
  return response;
}

export const config = {
  matcher: ['/admin/:path*'], // Apply middleware to /admin and all its subpaths
};
