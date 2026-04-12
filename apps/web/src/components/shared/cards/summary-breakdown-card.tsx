import type { LucideIcon } from "lucide-react"
import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, cn } from "@talimy/ui"

type SummaryBreakdownCardVariant = "navy" | "pink" | "sky"
type SummaryBreakdownCardTrendTone = "negative" | "neutral" | "positive"

export type SummaryBreakdownMetric = {
  id: string
  label: string
  share: string
  value: string
}

type SummaryBreakdownCardProps = {
  accentIcon?: LucideIcon
  className?: string
  metrics: readonly SummaryBreakdownMetric[]
  title: string
  totalChangeLabel?: string
  totalLabel: string
  totalValue: string
  trendTone?: SummaryBreakdownCardTrendTone
  variant?: SummaryBreakdownCardVariant
  watermarkIcon?: LucideIcon
}

type VariantTokens = {
  accentBadgeClassName: string
  cardClassName: string
  iconClassName: string
  textMutedClassName: string
  watermarkClassName: string
}

const VARIANT_TOKENS: Record<SummaryBreakdownCardVariant, VariantTokens> = {
  pink: {
    accentBadgeClassName: "bg-pink-200/90 text-slate-800",
    cardClassName: "bg-[linear-gradient(135deg,#f7c8fb_0%,#efb7f3_54%,#e4b2ef_100%)]",
    iconClassName: "text-slate-700",
    textMutedClassName: "text-slate-700/75",
    watermarkClassName: "text-white/18",
  },
  sky: {
    accentBadgeClassName: "bg-sky-100/95 text-slate-700",
    cardClassName: "bg-[linear-gradient(135deg,#ccecf7_0%,#c0e3f0_55%,#b6dae8_100%)]",
    iconClassName: "text-slate-700",
    textMutedClassName: "text-slate-700/75",
    watermarkClassName: "text-white/18",
  },
  navy: {
    accentBadgeClassName: "bg-slate-100/15 text-white",
    cardClassName: "bg-[linear-gradient(135deg,#1d4f81_0%,#1c4978_50%,#173e68_100%)]",
    iconClassName: "text-white",
    textMutedClassName: "text-white/70",
    watermarkClassName: "text-white/12",
  },
}

const TREND_TONE_CLASS_NAMES: Record<SummaryBreakdownCardTrendTone, string> = {
  negative: "bg-rose-500 text-white",
  neutral: "bg-slate-400 text-white",
  positive: "bg-emerald-500 text-white",
}

function SummaryTrendChip({ label, tone }: { label: string; tone: SummaryBreakdownCardTrendTone }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1 py-0.5 text-xs font-medium leading-none shadow-sm",
        TREND_TONE_CLASS_NAMES[tone]
      )}
    >
      <ArrowUpRight className="size-3" />
      <span>{label}</span>
    </div>
  )
}

function SummaryMetricItem({ metric }: { metric: SummaryBreakdownMetric }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-slate-500">{metric.label}</p>
      <p className="text-[1.05rem] font-semibold leading-none text-slate-900">{metric.value}</p>
      <div className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold leading-none text-slate-700">
        {metric.share}
      </div>
    </div>
  )
}

function SummaryWatermark({ icon: Icon, className }: { className: string; icon?: LucideIcon }) {
  if (!Icon) {
    return null
  }

  return (
    <Icon className={cn("absolute right-4 top-2 size-24 rotate-12", className)} strokeWidth={1.4} />
  )
}

export function SummaryBreakdownCard({
  accentIcon: AccentIcon = ArrowUpRight,
  className,
  metrics,
  title,
  totalChangeLabel,
  totalLabel,
  totalValue,
  trendTone = "positive",
  variant = "pink",
  watermarkIcon,
}: SummaryBreakdownCardProps) {
  const tokens = VARIANT_TOKENS[variant]

  return (
    <Card className={cn("overflow-hidden rounded-[22px] pt-0 border-0 shadow-none", className)}>
      <div className={cn("relative px-5 pb-5 pt-4 rounded-[22px]", tokens.cardClassName)}>
        <SummaryWatermark
          className={tokens.watermarkClassName}
          icon={watermarkIcon ?? AccentIcon}
        />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="space-y-4">
            <p
              className={cn(
                "text-[1rem] font-semibold",
                variant === "navy" ? "text-white" : "text-slate-900"
              )}
            >
              {title}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-semibold leading-none tracking-[-0.04em]",
                  variant === "navy" ? "text-white" : "text-slate-900"
                )}
              >
                {totalValue}
              </span>
              {totalChangeLabel ? (
                <SummaryTrendChip label={totalChangeLabel} tone={trendTone} />
              ) : null}
            </div>

            <p className={cn("text-sm font-medium", tokens.textMutedClassName)}>{totalLabel}</p>
          </div>

          <div
            className={cn(
              "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full",
              tokens.accentBadgeClassName
            )}
          >
            <AccentIcon className={cn("size-5", tokens.iconClassName)} strokeWidth={1.9} />
          </div>
        </div>
      </div>

      <CardContent className="grid grid-cols-3 gap-4 bg-white px-4 text-center">
        {metrics.map((metric) => (
          <SummaryMetricItem key={metric.id} metric={metric} />
        ))}
      </CardContent>
    </Card>
  )
}
