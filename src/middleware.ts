import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 1, // Per second
});

function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const forwardedIps = xForwardedFor.split(',').map(ip => ip.trim());
    return forwardedIps[0];
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp || request.ip || 'unknown';
}
export async function middleware(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    await rateLimiter.consume(ip);
    console.log(ip);

    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (token) {
      if (url.pathname === "/dashboard") {
        return NextResponse.next();
      }

      if (
        url.pathname.startsWith("/sign-in") ||
        url.pathname.startsWith("/sign-up") ||
        url.pathname.startsWith("/verify") ||
        url.pathname === "/"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }else{
      if (url.pathname === "/dashboard") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (rateLimiterRes) {
    return new NextResponse(`Too many requests from this IP ${getClientIp(request)}`, { status: 429 });
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard",
    "/verify/:paths*",
  ],
};
