
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [], // Providers added in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnLogin = nextUrl.pathname.startsWith("/auth/login")

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl))
        }
        return true
      }
      return true
    },
    async jwt({ token, user, trigger, session }) {
        if (user) {
          token.id = user.id
          token.role = user.role
          token.avatar = user.avatar
          // @ts-ignore
          token.permissions = user.permissions
        }
        return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | null
        // @ts-ignore
        session.user.permissions = token.permissions
      }
      return session
    },
  },
} satisfies NextAuthConfig
