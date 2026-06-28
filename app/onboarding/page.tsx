import { OnboardingForm } from "@/components/OnboardingForm";
import { PageHeader } from "@/components/PageHeader";

export default function OnboardingPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <PageHeader
        eyebrow="Onboarding"
        title="Tell us about your move."
        description="Answer a few questions and GermanyMove will create a starter checklist saved in this browser."
      />

      <OnboardingForm />
    </main>
  );
}
