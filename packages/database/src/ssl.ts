import type { ConnectionOptions } from "node:tls"

const SSL_DISABLE_VALUES = new Set(["disable", "false", "0", "no", "off"])
const SSL_NO_VERIFY_VALUES = new Set([
  "require",
  "true",
  "1",
  "yes",
  "on",
  "no-verify",
  "verify-ca",
  "verify-full",
])

function isPrivateIpv4(hostname: string): boolean {
  if (hostname.startsWith("10.")) return true
  if (hostname.startsWith("192.168.")) return true
  if (!hostname.startsWith("172.")) return false

  const [, secondOctet] = hostname.split(".")
  const secondOctetNumber = Number(secondOctet)

  return Number.isInteger(secondOctetNumber) && secondOctetNumber >= 16 && secondOctetNumber <= 31
}

function isPlaintextFriendlyHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    !hostname.includes(".") ||
    isPrivateIpv4(hostname)
  )
}

function getExplicitSslPreference(): string | null {
  const directPreference = process.env.DATABASE_SSL?.trim().toLowerCase()
  if (directPreference) return directPreference

  const modePreference = process.env.DATABASE_SSL_MODE?.trim().toLowerCase()
  if (modePreference) return modePreference

  return null
}

export function resolveDatabaseSsl(databaseUrl: string): false | ConnectionOptions {
  const explicitPreference = getExplicitSslPreference()

  if (explicitPreference) {
    if (SSL_DISABLE_VALUES.has(explicitPreference)) return false
    if (SSL_NO_VERIFY_VALUES.has(explicitPreference)) {
      return { rejectUnauthorized: false }
    }

    throw new Error(
      `Unsupported DATABASE_SSL/DATABASE_SSL_MODE value: "${explicitPreference}". Use disable|false or require|true|no-verify.`
    )
  }

  const hostname = new URL(databaseUrl).hostname

  if (isPlaintextFriendlyHost(hostname)) return false

  return { rejectUnauthorized: false }
}
