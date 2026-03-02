import type { AbstractIntlMessages } from "next-intl"
import { getRequestConfig } from "next-intl/server"
import { cookies, headers } from "next/headers"

import {
  APP_LOCALE_COOKIE,
  DEFAULT_LOCALE,
  type AppLocale,
  normalizeLocale,
  resolveLocaleFromAcceptLanguage,
} from "@/config/site"
import { normalizeMessages } from "@/i18n/normalize-messages"

type MessageModule = { default: AbstractIntlMessages }

const messageLoaders: Record<AppLocale, () => Promise<MessageModule>> = {
  uz: () => import("@/messages/uz.json"),
  tr: () => import("@/messages/tr.json"),
  en: () => import("@/messages/en.json"),
  ar: () => import("@/messages/ar.json"),
}

export default getRequestConfig(async ({ requestLocale }) => {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const localeFromRequest = normalizeLocale(await requestLocale)
  const localeFromCookie = normalizeLocale(cookieStore.get(APP_LOCALE_COOKIE)?.value)
  const localeFromHeader = normalizeLocale(headerStore.get("x-locale"))
  const localeFromAcceptLanguage = resolveLocaleFromAcceptLanguage(
    headerStore.get("accept-language")
  )

  const locale =
    localeFromRequest ??
    localeFromCookie ??
    localeFromHeader ??
    localeFromAcceptLanguage ??
    DEFAULT_LOCALE

  const messages = normalizeMessages(locale, (await messageLoaders[locale]()).default)

  return {
    locale,
    messages,
  }
})
