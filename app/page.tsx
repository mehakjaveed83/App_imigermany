import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <span className="text-lg font-bold text-ink">GermanyMove</span>
          <Button href="/login" variant="secondary">
            Log in
          </Button>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-coral">
              Moving to Germany
            </p>
            <h1 className="text-5xl font-bold leading-tight text-ink md:text-6xl">
              A clear relocation checklist for newcomers from South Asia.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Answer a few questions about your country, city, visa stage, and
              arrival date. GermanyMove turns that into a simple checklist you
              can track as you prepare.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/onboarding">Start checklist</Button>
              <Button href="/dashboard" variant="secondary">
                View demo dashboard
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted">Example plan</p>
                <h2 className="text-2xl font-bold text-ink">Berlin student move</h2>
              </div>
              <span className="rounded-full bg-[#e5f2ed] px-3 py-1 text-sm font-semibold text-forest">
                4 tasks
              </span>
            </div>
            <div className="space-y-3">
              {[
                "Prepare visa documents",
                "Compare health insurance options",
                "Plan Anmeldung documents",
                "Track arrival week essentials",
              ].map((task) => (
                <div
                  className="rounded-md border border-line bg-[#fbfaf7] px-4 py-3 text-sm font-medium text-ink"
                  key={task}
                >
                  {task}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
