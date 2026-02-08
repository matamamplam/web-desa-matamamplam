import NextAuth from "next-auth"
import { authConfig } from "./lib/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // Logic is now handled inside authorized callback in auth.config.ts
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
