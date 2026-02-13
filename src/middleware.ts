import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./lib/auth.config"
import { rateLimit } from "./lib/rate-limit"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
  
  // Rate Limit: API Routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    // Stricter limit for Auth API, but relaxed for usability
    // EXEMPTION: Always allow signout, csrf, and session to ensure app stability
    if (
      req.nextUrl.pathname === "/api/auth/signout" ||
      req.nextUrl.pathname === "/api/auth/csrf" ||
      req.nextUrl.pathname === "/api/auth/session"
    ) {
       return NextResponse.next();
    }

    const isAuthApi = req.nextUrl.pathname.startsWith("/api/auth")
    // Strict limit for Login (POST)
    // Relaxed for other API calls
    const limit = (isAuthApi && req.method === "POST") ? 10 : 100 
    const windowMs = 60 * 1000 // 1 minute

    
    try {
      // Simple In-Memory Rate Limit (per instance)
      const { success, limit: reqLimit, remaining, reset } = await rateLimit(ip, limit, windowMs)
      
      if (!success) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Too Many Requests. Please try again later." 
          }, 
          {
            status: 429,
            headers: {
              "X-RateLimit-Limit": reqLimit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
              "X-RateLimit-Reset": reset.toString()
            }
          }
        )
      }
    } catch (e) {
      console.error("Rate limit error", e)
    }
  }

  // Logic is now handled inside authorized callback in auth.config.ts
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)", "/api/:path*"],
}
