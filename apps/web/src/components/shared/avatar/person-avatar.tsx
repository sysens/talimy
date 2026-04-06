"use client"

import { cn } from "@talimy/ui"

type PersonAvatarProps = {
  alt: string
  className?: string
  fallback: string
  fallbackClassName?: string
  imageClassName?: string
  src?: string | null
}

export function PersonAvatar({
  alt,
  className,
  fallback,
  fallbackClassName,
  imageClassName,
  src,
}: PersonAvatarProps) {
  if (typeof src === "string" && src.length > 0) {
    return (
      <div className={cn("overflow-hidden rounded-full", className)}>
        <img
          alt={alt}
          className={cn("size-full object-cover", imageClassName)}
          loading="lazy"
          src={src}
        />
      </div>
    )
  }

  return (
    <div
      aria-label={alt}
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full",
        className,
        fallbackClassName
      )}
      role="img"
    >
      {fallback}
    </div>
  )
}
