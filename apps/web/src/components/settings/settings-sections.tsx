"use client"

import { useTranslations } from "next-intl"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Switch,
} from "@talimy/ui"
import { Bell, Book, Mail, Smartphone, BellRing } from "lucide-react"

export function ClassesTab() {
  const t = useTranslations("adminSettings")
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("classes.title")}</CardTitle>
          <CardDescription>{t("classes.description")}</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          {t("classes.add")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>{t("classes.table.name")}</TableHead>
                <TableHead>{t("classes.table.grade")}</TableHead>
                <TableHead>{t("classes.table.section")}</TableHead>
                <TableHead className="text-right">{t("classes.table.students")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Mathematics 101</TableCell>
                <TableCell>Grade 10</TableCell>
                <TableCell>Section A</TableCell>
                <TableCell className="text-right">24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Physics Basics</TableCell>
                <TableCell>Grade 9</TableCell>
                <TableCell>Section B</TableCell>
                <TableCell className="text-right">30</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">English Literature</TableCell>
                <TableCell>Grade 11</TableCell>
                <TableCell>Section A</TableCell>
                <TableCell className="text-right">20</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function SubjectsTab() {
  const t = useTranslations("adminSettings")
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("subjects.title")}</CardTitle>
          <CardDescription>{t("subjects.description")}</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          {t("subjects.add")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-slate-200">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>{t("subjects.table.name")}</TableHead>
                <TableHead>{t("subjects.table.code")}</TableHead>
                <TableHead className="w-[100px]">{t("subjects.table.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Mathematics</TableCell>
                <TableCell>MAT-100</TableCell>
                <TableCell>
                  <span className="text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Physics</TableCell>
                <TableCell>PHY-200</TableCell>
                <TableCell>
                  <span className="text-green-600 bg-green-100 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chemistry</TableCell>
                <TableCell>CHE-300</TableCell>
                <TableCell>
                  <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    Inactive
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export function ModulesTab() {
  const t = useTranslations("adminSettings")
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>{t("modules.title")}</CardTitle>
        <CardDescription>{t("modules.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("modules.dormitory")}</div>
              <p className="text-sm text-slate-500">
                Manage student housing and dormitory assignments.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("modules.meals")}</div>
              <p className="text-sm text-slate-500">Track and manage cafeteria meal plans.</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("modules.transport")}</div>
              <p className="text-sm text-slate-500">
                School bus routes and transportation management.
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
            <div className="space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("modules.finance")}</div>
              <p className="text-sm text-slate-500">Advanced fee structures and billing.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FeesTab() {
  const t = useTranslations("adminSettings")
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("fees.title")}</CardTitle>
          <CardDescription>{t("fees.description")}</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          {t("fees.add")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Tuition Fee</h3>
              <span className="text-sm text-slate-500">Default: $1,200/term</span>
            </div>
            <p className="text-sm text-slate-500">
              Standard educational cost covering regular classes.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Book & Supply Fee</h3>
              <span className="text-sm text-slate-500">Default: $150/year</span>
            </div>
            <p className="text-sm text-slate-500">Required educational materials and resources.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Extracurricular Activity Fee</h3>
              <span className="text-sm text-slate-500">Default: $50/activity</span>
            </div>
            <p className="text-sm text-slate-500">Optional clubs and sports activities.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationsTab() {
  const t = useTranslations("adminSettings")
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>{t("notifications.title")}</CardTitle>
        <CardDescription>{t("notifications.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("notifications.email")}</div>
              <p className="text-sm text-slate-500">Send system alerts and reports via email.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("notifications.sms")}</div>
              <p className="text-sm text-slate-500">
                Urgent notifications sent directly to phones.
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-0.5">
              <div className="text-base font-medium text-slate-900">{t("notifications.push")}</div>
              <p className="text-sm text-slate-500">In-app notifications on the platform.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Button>{t("notifications.save")}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
