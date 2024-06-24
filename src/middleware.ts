import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!user;
  console.log("isLoggedIn : ", isLoggedIn);

  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // If the user is logged in and tries to access the sign-in page, redirect to home page
  const isSignin = pathname.startsWith("/sign-in");
  if (isSignin && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If the pathname starts with /protected and the user is not an admin, redirect to the home page
  if (pathname.startsWith("/protected") && (!user || user.role !== "admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Continue with the request if the user is an admin or the route is not protected
  return NextResponse.next();
}
