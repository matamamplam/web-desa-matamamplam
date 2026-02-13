import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi")
        }


        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        // 1. Check for recent failed attempts (Brute Force Protection)
        const lockoutThreshold = 5
        const lockoutWindow = 15 * 60 * 1000 // 15 minutes
        
        const recentFailures = await prisma.loginAttempt.count({
          where: {
            email: credentials.email as string,
            isSuccess: false,
            attemptedAt: {
              gt: new Date(Date.now() - lockoutWindow)
            }
          }
        })

        if (recentFailures >= lockoutThreshold) {
          throw new Error("Akun terkunci sementara karena terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit.")
        }

        if (!user) {
           // Record failed attempt for non-existent user to prevent enumeration (optional, but good practice)
           await prisma.loginAttempt.create({
            data: {
              email: credentials.email as string,
              isSuccess: false,
              // ipAddress: req.ip // Note: IP tracking in next-auth credential provider is tricky without passing req
            }
          })
          throw new Error("Email atau password salah")
        }

        if (!user.isActive) {
          throw new Error("Akun Anda tidak aktif. Hubungi administrator.")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          // Record failed attempt
          await prisma.loginAttempt.create({
            data: {
              email: credentials.email as string,
              isSuccess: false,
            }
          })
          throw new Error("Email atau password salah")
        }

        // Login Success
        await prisma.loginAttempt.create({
            data: {
              email: credentials.email as string,
              isSuccess: true,
            }
        })


        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          permissions: user.permissions, // Add permissions
        }
      },
    }),
  ],
  callbacks: {
    // We can keep the extended functionality here for server-side auth
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
        // Run edge-compatible logic first
        // @ts-ignore
        if (authConfig.callbacks?.jwt) await authConfig.callbacks.jwt({ token, user, trigger, session })

        // Check DB availability (Server-side only logic)
        // If token has an ID, verify user still exists in DB and refresh data
        // Check DB availability (Server-side only logic)
        // If token has an ID, verify user still exists in DB and refresh data
        // Optimization: Only check DB if trigger is "update" or "signIn", or if it's been a while (e.g. 1 hour)
        const shouldRefresh = trigger === "update" || trigger === "signIn";
        
        if (token.id && shouldRefresh) {
            try {
                // Ensure we are in a context where prisma works (not edge)
                const freshUser = await prisma.user.findUnique({
                  where: { id: token.id as string },
                  select: { id: true, role: true, avatar: true, isActive: true, permissions: true }
                })

                if (!freshUser || !freshUser.isActive) {
                  return null // Invalidate session if user deleted or inactive
                }

                // Update token with fresh data (e.g. role/permissions changed)
                token.role = freshUser.role
                token.avatar = freshUser.avatar
                token.permissions = freshUser.permissions
            } catch (error) {
                // Ignore DB errors in edge cases or if prisma fails
                console.error("Auth verify error:", error)
            }
        }
        return token
    }
  }
})
