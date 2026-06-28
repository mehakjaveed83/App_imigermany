"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import {
  generateChecklist,
  type City,
  type Country,
  type Purpose,
  type Stage,
  type UserProfile,
} from "@/src/data/checklistRules";
import { saveChecklist } from "@/src/lib/checklistStorage";
import {
  mapChecklistRuleToUserTask,
  saveChecklistToSupabase,
} from "@/src/lib/supabaseChecklist";

const countryOptions = [
  { label: "India", value: "india" },
  { label: "Pakistan", value: "pakistan" },
  { label: "Bangladesh", value: "bangladesh" },
];

const purposeOptions = [
  { label: "Study", value: "study" },
  { label: "Work", value: "work" },
  { label: "Family Reunion", value: "family-reunion" },
];

const cityOptions = [
  { label: "Berlin", value: "berlin" },
  { label: "Munich", value: "munich" },
  { label: "Hamburg", value: "hamburg" },
  { label: "Frankfurt", value: "frankfurt" },
  { label: "Other", value: "other" },
];

const stageOptions = [
  { label: "Before visa", value: "before-visa" },
  { label: "Visa approved", value: "visa-approved" },
  { label: "Arrived in Germany", value: "arrived" },
];

export function OnboardingForm() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const profile: UserProfile = {
      country: formData.get("country") as Country,
      purpose: formData.get("purpose") as Purpose,
      city: formData.get("city") as City,
      stage: formData.get("stage") as Stage,
      arrivalDate: formData.get("arrivalDate") as string,
    };

    const generatedTasks = generateChecklist(profile).map(mapChecklistRuleToUserTask);

    saveChecklist({ profile, tasks: generatedTasks });
    await saveChecklistToSupabase(profile, generatedTasks);
    router.push("/dashboard");
  }

  return (
    <form
      className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Select label="Country" name="country" options={countryOptions} required />
        <Select label="Purpose" name="purpose" options={purposeOptions} required />
        <Select label="German city" name="city" options={cityOptions} required />
        <Select label="Stage" name="stage" options={stageOptions} required />
        <Input label="Arrival date" name="arrivalDate" type="date" required />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button type="submit">Generate checklist</Button>
        <Button type="button" href="/" variant="secondary">
          Back home
        </Button>
      </div>
    </form>
  );
}
