import { Button } from "@/components/Button";
import { DashboardChecklist } from "@/components/DashboardChecklist";
import { PageHeader } from "@/components/PageHeader";

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <PageHeader
        eyebrow="Dashboard"
        title="Your Germany move checklist"
        description="Your generated tasks and completion progress are saved locally in this browser for now."
        action={
          <Button href="/onboarding" variant="secondary">
            Edit answers
          </Button>
        }
      />

      <DashboardChecklist />
    </main>
  );
}
