export default async function Page() {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-semibold text-[color:var(--talimy-color-navy)]">
          Admin workspace shell is ready
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Sidebar, header, breadcrumb, and responsive app shell are now mounted here. Dashboard
          widgets and sections can be composed on top of this layout in the next task.
        </p>
      </div>
    </section>
  )
}
