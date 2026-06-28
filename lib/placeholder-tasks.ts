export type ChecklistTask = {
  id: string;
  title: string;
  category: string;
  dueText: string;
  completed: boolean;
};

export const placeholderTasks: ChecklistTask[] = [
  {
    id: "passport",
    title: "Check passport validity",
    category: "Documents",
    dueText: "Recommended before booking visa appointments",
    completed: true,
  },
  {
    id: "blocked-account",
    title: "Prepare blocked account or proof of funds",
    category: "Finance",
    dueText: "Usually needed before visa submission",
    completed: false,
  },
  {
    id: "housing",
    title: "Collect temporary housing proof",
    category: "Arrival",
    dueText: "Useful for city registration after arrival",
    completed: false,
  },
  {
    id: "insurance",
    title: "Review health insurance options",
    category: "Health",
    dueText: "Start before arrival, confirm after enrollment or employment",
    completed: false,
  },
];
