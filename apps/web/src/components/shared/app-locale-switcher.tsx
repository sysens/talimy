"use client"

import { LocaleSwitcher } from "@talimy/ui"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { APP_LOCALE_COOKIE, type AppLocale } from "@/config/site"

const LOCALES: AppLocale[] = ["uz", "en", "tr", "ar"]

type AppLocaleSwitcherProps = {
  className?: string
}

export function AppLocaleSwitcher({ className }: AppLocaleSwitcherProps) {
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const t = useTranslations("authPage.locales")
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = (nextLocale: string) => {
    if (locale === nextLocale) {
      return
    }

    document.cookie = `${APP_LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <LocaleSwitcher
      items={LOCALES.map((item) => ({
        value: item,
        label: t(item),
      }))}
      value={locale}
      disabled={isPending}
      onChange={handleLocaleChange}
      className={className}
    />
  )
}
