"use client"

import { useTranslations } from "next-intl"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@talimy/ui"
import { Users, BookOpen, Layers, CreditCard, Bell, Building2 } from "lucide-react"

import { SchoolInfoTab } from "@/components/settings/school-info-tab"
import {
  ClassesTab,
  SubjectsTab,
  ModulesTab,
  FeesTab,
  NotificationsTab,
} from "@/components/settings/settings-sections"

export default function AdminSettingsPage() {
  const t = useTranslations("adminSettings")

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{t("title")}</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">{t("description")}</p>
      </div>

      <Tabs defaultValue="schoolInfo" className="flex flex-col md:flex-row gap-8">
        <TabsList className="md:w-64 h-fit flex-col bg-transparent justify-start space-y-1 p-0 rounded-none w-full border-r border-slate-200">
          <TabsTrigger
            value="schoolInfo"
            className="w-full justify-start rounded-r-none rounded-l-lg px-4 py-3 border-r-2 border-transparent data-[state=active]:bg-white data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <Building2 className="mr-3 h-4 w-4" />
            {t("tabs.schoolInfo")}
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="w-full justify-start rounded-r-none rounded-l-lg px-4 py-3 border-r-2 border-transparent data-[state=active]:bg-white data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <Users className="mr-3 h-4 w-4" />
            {t("tabs.classes")}
          </TabsTrigger>
          <TabsTrigger
            value="subjects"
            className="w-full justify-start rounded-r-none rounded-l-lg px-4 py-3 border-r-2 border-transparent data-[state=active]:bg-white data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <BookOpen className="mr-3 h-4 w-4" />
            {t("tabs.subjects")}
          </TabsTrigger>
          <TabsTrigger
            value="modules"
            className="w-full justify-start rounded-r-none rounded-l-lg px-4 py-3 border-r-2 border-transparent data-[state=active]:bg-white data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <Layers className="mr-3 h-4 w-4" />
            {t("tabs.modules")}
          </TabsTrigger>
          <TabsTrigger
            value="fees"
            className="w-full justify-start rounded-r-none rounded-l-lg px-4 py-3 border-r-2 border-transparent data-[state=active]:bg-white data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <CreditCard className="mr-3 h-4 w-4" />
            {t("tabs.fees")}
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="w-full justify-start rounded-r-none rounded-l-lg px-4 py-3 border-r-2 border-transparent data-[state=active]:bg-white data-[state=active]:border-primary data-[state=active]:shadow-sm data-[state=active]:text-primary"
          >
            <Bell className="mr-3 h-4 w-4" />
            {t("tabs.notifications")}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="schoolInfo" className="mt-0 outline-none">
            <SchoolInfoTab />
          </TabsContent>
          <TabsContent value="classes" className="mt-0 outline-none">
            <ClassesTab />
          </TabsContent>
          <TabsContent value="subjects" className="mt-0 outline-none">
            <SubjectsTab />
          </TabsContent>
          <TabsContent value="modules" className="mt-0 outline-none">
            <ModulesTab />
          </TabsContent>
          <TabsContent value="fees" className="mt-0 outline-none">
            <FeesTab />
          </TabsContent>
          <TabsContent value="notifications" className="mt-0 outline-none">
            <NotificationsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
