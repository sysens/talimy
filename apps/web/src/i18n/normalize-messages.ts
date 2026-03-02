import type { AbstractIntlMessages } from "next-intl"

import type { AppLocale } from "@/config/site"

const EXACT_MESSAGE_FIXES: Partial<Record<AppLocale, Record<string, string>>> = {
  tr: {
    "shell.searchPlaceholder::Her ?eyi ara": "Her şeyi ara",
  },
  ar: {
    "shell.searchPlaceholder::???? ?? ?? ???": "ابحث عن أي شيء",
    "shell.settings::?????????": "الإعدادات",
    "shell.notifications::?????????": "الإشعارات",
  },
}

export function normalizeMessages(
  locale: AppLocale,
  messages: AbstractIntlMessages
): AbstractIntlMessages {
  return walkMessages(messages, locale) as AbstractIntlMessages
}

function walkMessages(
  input: unknown,
  locale: AppLocale,
  path = ""
): unknown {
  if (Array.isArray(input)) {
    return input.map((entry, index) => {
      if (typeof entry === "string") {
        return repairMessageValue(locale, `${path}[${index}]`, entry)
      }

      return walkMessages(entry, locale, `${path}[${index}]`)
    })
  }

  if (!input || typeof input !== "object") {
    return input
  }

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      const nextPath = path ? `${path}.${key}` : key

      if (typeof value === "string") {
        return [key, repairMessageValue(locale, nextPath, value)]
      }

      if (value && typeof value === "object") {
        return [key, walkMessages(value, locale, nextPath)]
      }

      return [key, value]
    })
  )
}

function repairMessageValue(locale: AppLocale, path: string, value: string): string {
  const exactFix = EXACT_MESSAGE_FIXES[locale]?.[`${path}::${value}`]
  if (exactFix) {
    return exactFix
  }

  if (!looksLikeMojibake(value)) {
    return value
  }

  const repaired = tryDecodeMojibake(value)
  return looksMoreReadable(repaired, value) ? repaired : value
}

function looksLikeMojibake(value: string): boolean {
  return /[ÃÅÄØÙâ�]/.test(value)
}

function tryDecodeMojibake(value: string): string {
  try {
    return Buffer.from(value, "latin1").toString("utf8")
  } catch {
    return value
  }
}

function looksMoreReadable(candidate: string, original: string): boolean {
  return scoreString(candidate) < scoreString(original)
}

function scoreString(value: string): number {
  let score = 0

  for (const char of value) {
    if ("ÃÅÄØÙâ�".includes(char)) {
      score += 5
    } else if (char === "?") {
      score += 3
    }
  }

  return score
}
