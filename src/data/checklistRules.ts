export type Country = "india" | "pakistan" | "bangladesh";
export type Purpose = "study" | "work" | "family-reunion";
export type City = "berlin" | "munich" | "hamburg" | "frankfurt" | "other";
export type Stage = "before-visa" | "visa-approved" | "arrived";
export type Priority = "high" | "medium" | "low";

export type UserProfile = {
  country: Country;
  purpose: Purpose;
  city: City;
  stage: Stage;
  arrivalDate: string;
};

export type ChecklistTask = {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: Priority;
  appliesToCountries: Country[];
  appliesToPurposes: Purpose[];
  appliesToStages: Stage[];
  appliesToCities: City[];
  dueOffsetDays: number;
};

const allCountries: Country[] = ["india", "pakistan", "bangladesh"];
const allPurposes: Purpose[] = ["study", "work", "family-reunion"];
const allStages: Stage[] = ["before-visa", "visa-approved", "arrived"];
const allCities: City[] = ["berlin", "munich", "hamburg", "frankfurt", "other"];

export const checklistRules: ChecklistTask[] = [
  {
    id: "visa-document-check",
    title: "Review your visa document list",
    category: "Visa",
    description:
      "Check the German mission website for your country and confirm the documents needed for your purpose of stay.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["before-visa"],
    appliesToCities: allCities,
    dueOffsetDays: -90,
  },
  {
    id: "visa-appointment-booking",
    title: "Book or track your visa appointment",
    category: "Visa",
    description:
      "Visa appointment timelines can be long. Save your appointment details and prepare documents early.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["before-visa"],
    appliesToCities: allCities,
    dueOffsetDays: -75,
  },
  {
    id: "proof-of-funds",
    title: "Prepare proof of funds",
    category: "Money",
    description:
      "Students often need a blocked account. Workers and family applicants may need salary, sponsor, or savings proof depending on their case.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["before-visa"],
    appliesToCities: allCities,
    dueOffsetDays: -70,
  },
  {
    id: "travel-budget",
    title: "Plan your first-month budget",
    category: "Money",
    description:
      "Estimate rent deposit, temporary housing, local transport, food, SIM card, insurance, and city registration costs.",
    priority: "medium",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["before-visa", "visa-approved"],
    appliesToCities: allCities,
    dueOffsetDays: -45,
  },
  {
    id: "health-insurance-before-arrival",
    title: "Compare health insurance options",
    category: "Health insurance",
    description:
      "Review public, private, travel, or incoming insurance options based on your visa purpose and arrival timing.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["before-visa", "visa-approved"],
    appliesToCities: allCities,
    dueOffsetDays: -35,
  },
  {
    id: "student-enrollment-insurance",
    title: "Prepare insurance proof for university enrollment",
    category: "Health insurance",
    description:
      "Most students need acceptable health insurance confirmation before completing enrollment at a German university.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: ["study"],
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: -14,
  },
  {
    id: "temporary-housing",
    title: "Book temporary housing for arrival",
    category: "Housing",
    description:
      "Arrange a safe place to stay for your first weeks and keep the booking confirmation accessible.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["before-visa", "visa-approved"],
    appliesToCities: allCities,
    dueOffsetDays: -30,
  },
  {
    id: "housing-documents",
    title: "Ask about Anmeldung documents from your landlord",
    category: "Housing",
    description:
      "For city registration, you usually need a landlord confirmation called Wohnungsgeberbestatigung.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: -7,
  },
  {
    id: "anmeldung-appointment-berlin",
    title: "Look for a Berlin Anmeldung appointment",
    category: "Anmeldung",
    description:
      "Berlin appointments can be hard to find. Start checking Buergeramt slots as soon as you have an address.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: ["berlin"],
    dueOffsetDays: 3,
  },
  {
    id: "anmeldung-appointment-general",
    title: "Register your address after arrival",
    category: "Anmeldung",
    description:
      "Book city registration and bring your passport, registration form, and landlord confirmation if available.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: ["munich", "hamburg", "frankfurt", "other"],
    dueOffsetDays: 7,
  },
  {
    id: "bank-account",
    title: "Open a German bank account",
    category: "Bank account",
    description:
      "A local or EU bank account helps with rent, salary, insurance payments, and everyday expenses.",
    priority: "medium",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: 10,
  },
  {
    id: "sim-card",
    title: "Get a German SIM card",
    category: "SIM card",
    description:
      "Choose a prepaid or contract SIM so you can receive calls from landlords, employers, universities, and public offices.",
    priority: "medium",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: 2,
  },
  {
    id: "university-onboarding",
    title: "Complete university onboarding steps",
    category: "University onboarding",
    description:
      "Check enrollment, semester fee payment, student portal access, course registration, and student ID collection.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: ["study"],
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: 5,
  },
  {
    id: "job-onboarding",
    title: "Prepare job onboarding documents",
    category: "Job onboarding",
    description:
      "Ask your employer which documents they need, such as tax ID, bank details, insurance confirmation, and address registration.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: ["work"],
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: 5,
  },
  {
    id: "family-reunion-office-docs",
    title: "Organize family reunion documents",
    category: "Family reunion",
    description:
      "Keep marriage, birth, address, income, and insurance documents ready for follow-up appointments in Germany.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: ["family-reunion"],
    appliesToStages: ["visa-approved", "arrived"],
    appliesToCities: allCities,
    dueOffsetDays: 7,
  },
  {
    id: "residence-permit-appointment",
    title: "Check residence permit appointment requirements",
    category: "Residence permit",
    description:
      "After arrival, check your local immigration office process and collect documents before your visa or entry permission expires.",
    priority: "high",
    appliesToCountries: allCountries,
    appliesToPurposes: allPurposes,
    appliesToStages: ["arrived"],
    appliesToCities: allCities,
    dueOffsetDays: 21,
  },
];

export function generateChecklist(userProfile: UserProfile): ChecklistTask[] {
  return checklistRules.filter((task) => {
    return (
      task.appliesToCountries.includes(userProfile.country) &&
      task.appliesToPurposes.includes(userProfile.purpose) &&
      task.appliesToStages.includes(userProfile.stage) &&
      task.appliesToCities.includes(userProfile.city)
    );
  });
}
