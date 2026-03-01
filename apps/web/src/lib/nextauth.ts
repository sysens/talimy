import NextAuth from "next-auth"

import { nextAuthConfig } from "@/lib/nextauth-config"

export const { auth, handlers, signIn, signOut } = NextAuth(nextAuthConfig)
