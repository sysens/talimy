"use client"

import * as React from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@talimy/ui"
import { useTranslations } from "next-intl"

import type {
  Notice,
  NoticeAudience,
  NoticeCategory,
} from "@/components/admin/notices/notices-api.types"

const CATEGORY_OPTIONS: readonly NoticeCategory[] = [
  "academic",
  "events",
  "maintenance",
  "finance",
  "holiday",
  "sports",
  "other",
]

const AUDIENCE_OPTIONS: readonly { value: NoticeAudience; labelKey: string }[] = [
  { labelKey: "students", value: "students" },
  { labelKey: "teachers", value: "teachers" },
  { labelKey: "parents", value: "parents" },
  { labelKey: "staff", value: "staff" },
  { labelKey: "all", value: "all" },
]

type AddEditNoticeModalProps = {
  initialData?: Notice | null
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    audience: NoticeAudience[]
    category: NoticeCategory
    content: string
    expirationDate: string
    postDate: string
    title: string
  }) => Promise<void> | void
  open: boolean
}

export function AddEditNoticeModal({
  initialData,
  onOpenChange,
  onSubmit,
  open,
}: AddEditNoticeModalProps) {
  const t = useTranslations("adminNotices.modal")
  const tCat = useTranslations("adminNotices.categories")
  const tAud = useTranslations("adminNotices.audience")

  const isEdit = Boolean(initialData)

  const [title, setTitle] = React.useState(initialData?.title ?? "")
  const [category, setCategory] = React.useState<NoticeCategory>(
    initialData?.category ?? "academic"
  )
  const [content, setContent] = React.useState(initialData?.content ?? "")
  const [postDate, setPostDate] = React.useState(
    initialData?.postDate ? initialData.postDate.slice(0, 10) : ""
  )
  const [expirationDate, setExpirationDate] = React.useState(
    initialData?.expirationDate ? initialData.expirationDate.slice(0, 10) : ""
  )
  const [audience, setAudience] = React.useState<NoticeAudience[]>(
    initialData?.audience ?? ["students"]
  )
  const [isPending, setIsPending] = React.useState(false)

  // Reset when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? "")
      setCategory(initialData?.category ?? "academic")
      setContent(initialData?.content ?? "")
      setPostDate(initialData?.postDate ? initialData.postDate.slice(0, 10) : "")
      setExpirationDate(initialData?.expirationDate ? initialData.expirationDate.slice(0, 10) : "")
      setAudience(initialData?.audience ?? ["students"])
    }
  }, [open, initialData])

  function toggleAudience(value: NoticeAudience) {
    setAudience((prev) =>
      prev.includes(value) ? prev.filter((a) => a !== value) : [...prev, value]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !postDate || !expirationDate) return
    setIsPending(true)
    try {
      await onSubmit({ audience, category, content, expirationDate, postDate, title })
      onOpenChange(false)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-xl rounded-[24px] border-slate-100 p-0">
        <form className="space-y-5 p-6" onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-semibold text-talimy-navy">
              {isEdit ? t("editTitle") : t("addTitle")}
            </DialogTitle>
            <DialogDescription className="text-[13px]">
              {isEdit ? t("editDescription") : t("addDescription")}
            </DialogDescription>
          </DialogHeader>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="notice-title">{t("fields.titleLabel")}</Label>
            <Input
              id="notice-title"
              className="h-11 rounded-2xl"
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("fields.titlePlaceholder")}
              required
              value={title}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="notice-category">{t("fields.categoryLabel")}</Label>
            <Select onValueChange={(v) => setCategory(v as NoticeCategory)} value={category}>
              <SelectTrigger className="h-11 rounded-2xl" id="notice-category">
                <SelectValue placeholder={t("fields.categoryPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {tCat(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audience */}
          <div className="space-y-2">
            <Label>{t("fields.audienceLabel")}</Label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_OPTIONS.map((opt) => {
                const isSelected = audience.includes(opt.value)
                return (
                  <button
                    className={[
                      "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                      isSelected
                        ? "border-(--talimy-color-pink)/40 bg-(--talimy-color-pink)/15 text-talimy-pink"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                    key={opt.value}
                    onClick={() => toggleAudience(opt.value)}
                    type="button"
                  >
                    {tAud(opt.labelKey)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="notice-content">{t("fields.contentLabel")}</Label>
            <Textarea
              id="notice-content"
              className="min-h-[100px] resize-none rounded-2xl"
              maxLength={1000}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("fields.contentPlaceholder")}
              required
              value={content}
            />
          </div>

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="notice-post-date">{t("fields.postDateLabel")}</Label>
              <Input
                id="notice-post-date"
                className="h-11 rounded-2xl"
                onChange={(e) => setPostDate(e.target.value)}
                required
                type="date"
                value={postDate}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-exp-date">{t("fields.expDateLabel")}</Label>
              <Input
                id="notice-exp-date"
                className="h-11 rounded-2xl"
                min={postDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
                type="date"
                value={expirationDate}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-1 sm:justify-end">
            <Button
              className="h-10 rounded-2xl"
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              {t("actions.cancel")}
            </Button>
            <Button
              className="h-10 rounded-2xl bg-talimy-pink text-talimy-navy shadow-none hover:bg-talimy-pink/90"
              disabled={isPending}
              type="submit"
            >
              {isPending
                ? t("actions.submitting")
                : isEdit
                  ? t("actions.update")
                  : t("actions.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
