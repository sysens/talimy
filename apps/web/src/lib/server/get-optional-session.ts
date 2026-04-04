import type { Session } from "next-auth"

import { auth } from "@/lib/nextauth"

export async function getOptionalSession(): Promise<Session | null> {
  try {
    return await auth()
  } catch {
    return null
  }
}
