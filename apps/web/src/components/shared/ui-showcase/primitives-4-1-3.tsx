"use client"

import { useState } from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@talimy/ui"

export function PrimitivesShowcase413() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">Tabs / Card</h2>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>School Overview</CardTitle>
                <CardDescription>Tenant bo‘yicha umumiy ko‘rsatkichlar.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Students</span>
                  <span className="text-sm font-medium">1,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Teachers</span>
                  <span className="text-sm font-medium">86</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance">
            <Card>
              <CardHeader>
                <CardTitle>Finance Snapshot</CardTitle>
                <CardDescription>To‘lovlar va qarzdorlik holati.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Collected</span>
                  <span className="text-sm font-medium">$90,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Outstanding</span>
                  <span className="text-sm font-medium">$2,000</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Health</CardTitle>
                <CardDescription>Haftalik davomat trendi.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average</span>
                  <span className="text-sm font-medium">96.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk class</span>
                  <span className="text-sm font-medium">Grade 8-B</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Badge / Avatar / Separator / Skeleton
        </h2>

        <Card>
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/96?img=32" alt="School admin" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">School Admin</p>
                <p className="text-xs text-muted-foreground">
                  school-admin.main@mezana.talimy.space
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">Mixed School</Badge>
              <Badge variant="outline">Term 2</Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Loading preview</p>
              <Button variant="outline" size="sm" onClick={() => setIsLoading((prev) => !prev)}>
                Toggle
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Skeleton holati test qilindi, content tayyor holatda.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
