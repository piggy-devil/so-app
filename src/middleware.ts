import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(request: NextRequest) {
    const { nextUrl } = request;
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // ตรวจสอบว่า token มีหรือไม่ ถ้าไม่มีให้รีไดเรกไปที่หน้า sign-in
    if (!token) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // ตรวจสอบว่า token มี username หรือไม่ ถ้าไม่มีให้รีไดเรกไปที่หน้า setname
    // if (!token?.username) {
    //   if (nextUrl.pathname !== "/setname") {
    //     return NextResponse.redirect(new URL("/setname", request.url));
    //   } else {
    //     return NextResponse.next();
    //   }
    // }

    // ปล่อยให้การร้องขอดำเนินต่อไปถ้ามี username
    // return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // อนุญาตถ้า token มีอยู่
        return !!token;
      },
    },
  }
  //   {
  //     callbacks: {
  //       authorized: async ({ req, token }) => {
  //         if (req.nextUrl.pathname.startsWith("/admin"))
  //           return token?.role === "admin";
  //         return !!token;
  //       },
  //     },
  //   }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
