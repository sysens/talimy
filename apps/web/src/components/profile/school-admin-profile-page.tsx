"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type GenderPolicy, type GenderScope, updateMyGenderScopeSchema } from "@talimy/shared"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@talimy/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Calendar,
  CheckCircle2,
  Laptop,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Shield,
  Clock,
  LogOut,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { sileo } from "sileo"

import { PersonalInfoCard } from "@/components/shared/profile/personal-info-card"
import { ProfileOverviewCard } from "@/components/shared/profile/profile-overview-card"
import { MutedPanelCard } from "@/components/shared/surfaces/muted-panel-card"
import { RecentActivity } from "@/components/shared/activity/recent-activity"

import {
  getSchoolAdminGenderScopeSettings,
  type SchoolAdminGenderScopeSettings,
  updateSchoolAdminGenderScope,
} from "@/lib/school-admin-gender-scope"
import { useAuthStore } from "@/stores/auth-store"

const SETTINGS_QUERY_KEY = ["school-admin-gender-scope-settings"] as const

type GenderScopeFormValues = {
  genderScope: GenderScope
}

export function SchoolAdminProfilePage() {
  const t = useTranslations("schoolAdminProfile")
  const queryClient = useQueryClient()
  const { data: session, update: updateSession } = useSession()
  const authUser = useAuthStore((state) => state.user)
  const tenant = useAuthStore((state) => state.tenant)
  const permissions = useAuthStore((state) => state.permissions)
  const setSession = useAuthStore((state) => state.setSession)

  const form = useForm<GenderScopeFormValues>({
    resolver: zodResolver(updateMyGenderScopeSchema),
    defaultValues: {
      genderScope: authUser?.genderScope ?? "all",
    },
  })

  const settingsQuery = useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getSchoolAdminGenderScopeSettings,
  })

  useEffect(() => {
    if (!settingsQuery.data) {
      return
    }

    form.reset({
      genderScope: settingsQuery.data.genderScope,
    })
  }, [form, settingsQuery.data])

  const mutation = useMutation({
    mutationFn: async (values: GenderScopeFormValues) =>
      updateSchoolAdminGenderScope(values.genderScope),
    onSuccess: async ({ settings, session: refreshedSession }) => {
      const expiresAt = Date.now() + refreshedSession.expiresIn * 1000
      if (authUser) {
        setSession({
          user: {
            ...authUser,
            genderScope: settings.genderScope,
          },
          accessToken: refreshedSession.accessToken,
          refreshToken: refreshedSession.refreshToken,
          tenant: tenant ?? {
            id: settings.tenantId,
            name: settings.tenantName,
          },
          permissions,
        })
      }

      await updateSession({
        accessToken: refreshedSession.accessToken,
        refreshToken: refreshedSession.refreshToken,
        expiresAt,
        user: {
          ...session?.user,
          genderScope: settings.genderScope,
        },
      })

      queryClient.setQueryData(SETTINGS_QUERY_KEY, settings)
      form.reset({ genderScope: settings.genderScope })

      sileo.success({
        title: t("toastSuccessTitle"),
        description: t("toastSuccessDescription"),
        position: "top-center",
      })
    },
    onError: (error) => {
      sileo.error({
        title: t("toastErrorTitle"),
        description: error instanceof Error ? error.message : t("toastErrorDescription"),
        position: "top-center",
      })
    },
  })

  const selectedGenderScope = form.watch("genderScope")
  const settings = settingsQuery.data
  const isSubmitting = mutation.isPending
  const isSaveDisabled =
    !settings ||
    isSubmitting ||
    selectedGenderScope === settings.genderScope ||
    settings.availableGenderScopes.length === 0

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{t("title")}</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{t("description")}</p>
      </div>

      <ProfileOverviewCard
        avatarFallback={authUser?.name?.charAt(0).toUpperCase() ?? "A"}
        name={settings?.fullName ?? authUser?.name ?? t("adminNameLabel")}
        badges={[
          { label: "School Admin", tone: "info" },
          { label: settings?.tenantName ?? tenant?.name ?? t("schoolLabel"), tone: "muted" },
        ]}
      />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6 w-full justify-start border-b border-slate-200 bg-transparent p-0 text-slate-500 rounded-none h-12">
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium hover:text-slate-950 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {t("tabs.personal")}
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium hover:text-slate-950 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {t("tabs.security")}
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-3 font-medium hover:text-slate-950 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {t("tabs.activity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-0 outline-none">
          <PersonalInfoCard
            title={t("personalInfo.title")}
            actionLabel={t("personalInfo.edit")}
            onActionPress={() => {}}
            items={[
              {
                icon: <Mail className="h-5 w-5" />,
                label: t("personalInfo.email"),
                value: settings?.email ?? authUser?.email ?? "admin@talimy.space",
              },
              {
                icon: <Phone className="h-5 w-5" />,
                label: t("personalInfo.phone"),
                value: "+998 90 123 45 67",
              },
              {
                icon: <MapPin className="h-5 w-5" />,
                label: t("personalInfo.address"),
                value: "Tashkent, Uzbekistan",
              },
              {
                icon: <Calendar className="h-5 w-5" />,
                label: t("personalInfo.dob"),
                value: "1990-01-01",
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="security" className="mt-0 outline-none space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="space-y-3 pb-4">
              <CardTitle className="text-lg text-slate-950">{t("security.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>{t("security.oldPassword")}</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>{t("security.newPassword")}</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>{t("security.confirmPassword")}</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="mt-5">
                <Button>{t("security.updatePassword")}</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-lg text-slate-950">{t("cardTitle")}</CardTitle>
                {settings ? (
                  <Badge variant="outline" className="border-slate-200 text-slate-600">
                    {resolvePolicyLabel(t, settings.tenantGenderPolicy)}
                  </Badge>
                ) : null}
              </div>
              <CardDescription className="max-w-2xl text-sm leading-7 text-slate-600">
                {t("cardDescription")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {settingsQuery.isLoading ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  {t("loading")}
                </div>
              ) : null}

              {settingsQuery.isError ? (
                <div className="space-y-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-5">
                  <p className="text-sm leading-7 text-red-700">{t("loadError")}</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void settingsQuery.refetch()}
                  >
                    {t("retry")}
                  </Button>
                </div>
              ) : null}

              {settings ? (
                <form
                  className="space-y-5"
                  onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                >
                  <fieldset disabled={isSubmitting} className="space-y-5">
                    <div className="space-y-2">
                      <Label>{t("fieldLabel")}</Label>
                      <p className="text-sm leading-7 text-slate-600">{t("fieldDescription")}</p>
                    </div>

                    <Controller
                      control={form.control}
                      name="genderScope"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => field.onChange(value as GenderScope)}
                          className="gap-3"
                        >
                          {settings.availableGenderScopes.map((option) => (
                            <label
                              key={option}
                              htmlFor={`gender-scope-${option}`}
                              className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition hover:border-slate-300"
                            >
                              <RadioGroupItem
                                id={`gender-scope-${option}`}
                                value={option}
                                className="mt-1"
                              />
                              <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-950">
                                  {resolveScopeLabel(t, option)}
                                </p>
                                <p className="text-sm leading-7 text-slate-600">
                                  {resolveScopeDescription(t, option)}
                                </p>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      )}
                    />

                    {settings.availableGenderScopes.length === 1 ? (
                      <p className="text-sm leading-7 text-slate-600">{t("policyLockedHint")}</p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3">
                      <Button type="submit" disabled={isSaveDisabled}>
                        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? t("savePending") : t("save")}
                      </Button>
                      <p className="text-sm leading-7 text-slate-500">
                        {t("currentScopeHint", {
                          scope: resolveScopeLabel(t, settings.genderScope).toLowerCase(),
                        })}
                      </p>
                    </div>
                  </fieldset>
                </form>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-slate-950">{t("sessions.title")}</CardTitle>
                  <CardDescription className="mt-1.5 flex max-w-2xl items-center gap-2 text-sm leading-7 text-slate-600">
                    {t("sessions.description")}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("sessions.disconnectAll")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <Laptop className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Windows • Chrome</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Active now
                      </span>
                      <span>•</span>
                      <span>Tashkent, UZ</span>
                      <span>•</span>
                      <span>192.168.1.1</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Current session
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-0 outline-none">
          <MutedPanelCard className="p-6">
            <RecentActivity
              title={t("activity.title")}
              emptyState={t("activity.empty")}
              items={[
                {
                  id: "1",
                  icon: Shield,
                  iconClassName: "text-blue-600",
                  iconBackgroundClassName: "bg-blue-100",
                  description: "Changed gender scope policy",
                  timestamp: "1 day ago",
                },
                {
                  id: "2",
                  icon: CheckCircle2,
                  iconClassName: "text-green-600",
                  iconBackgroundClassName: "bg-green-100",
                  description: "Logged in successfully",
                  timestamp: "2 days ago",
                },
                {
                  id: "3",
                  icon: Clock,
                  iconClassName: "text-orange-600",
                  iconBackgroundClassName: "bg-orange-100",
                  description: "Updated class schedule for Grade 10",
                  timestamp: "3 days ago",
                },
              ]}
            />
          </MutedPanelCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function resolvePolicyLabel(
  t: ReturnType<typeof useTranslations<"schoolAdminProfile">>,
  policy: GenderPolicy
): string {
  switch (policy) {
    case "boys_only":
      return t("policyBoysOnlyShort")
    case "girls_only":
      return t("policyGirlsOnlyShort")
    case "mixed":
    default:
      return t("policyMixedShort")
  }
}

function resolvePolicyDescription(
  t: ReturnType<typeof useTranslations<"schoolAdminProfile">>,
  policy: GenderPolicy
): string {
  switch (policy) {
    case "boys_only":
      return t("policyBoysOnlyDescription")
    case "girls_only":
      return t("policyGirlsOnlyDescription")
    case "mixed":
    default:
      return t("policyMixedDescription")
  }
}

function resolveScopeLabel(
  t: ReturnType<typeof useTranslations<"schoolAdminProfile">>,
  scope: GenderScope
): string {
  switch (scope) {
    case "male":
      return t("scopeMaleLabel")
    case "female":
      return t("scopeFemaleLabel")
    case "all":
    default:
      return t("scopeAllLabel")
  }
}

function resolveScopeDescription(
  t: ReturnType<typeof useTranslations<"schoolAdminProfile">>,
  scope: GenderScope
): string {
  switch (scope) {
    case "male":
      return t("scopeMaleDescription")
    case "female":
      return t("scopeFemaleDescription")
    case "all":
    default:
      return t("scopeAllDescription")
  }
}
