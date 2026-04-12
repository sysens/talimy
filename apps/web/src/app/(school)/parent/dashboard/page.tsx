import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@talimy/ui"

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
          Parent Dashboard
        </Badge>
        <Card className="border-slate-200 shadow-none">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl font-semibold text-slate-900">
              Parent panel tayyorlanmoqda
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7 text-slate-600">
              Bu route endi bo‘sh sahifa emas. Keyingi fazada farzandlar ko‘rsatkichlari, davomati,
              topshiriqlari va to‘lov holati shu yerga joylashtiriladi.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-500">Keyingi bo‘limlar</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>Farzand overview</li>
                <li>Attendance snapshot</li>
                <li>Assignments and notices</li>
                <li>Payment summary</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-slate-500">Hozirgi holat</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Auth va routing ishlayapti. Bu placeholder oq sahifa chiqmasligi uchun vaqtinchalik
                page-level render sifatida turadi.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
