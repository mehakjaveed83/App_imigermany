import type { ChecklistTask, UserProfile } from "@/src/data/checklistRules";

export type SavedChecklistTask = ChecklistTask & {
  completed: boolean;
  notes: string;
};

export type SavedChecklist = {
  profile: UserProfile;
  tasks: SavedChecklistTask[];
};

export const checklistStorageKey = "germanymove-checklist";

export function saveChecklist(checklist: SavedChecklist) {
  window.localStorage.setItem(checklistStorageKey, JSON.stringify(checklist));
}

export function loadChecklist(): SavedChecklist | null {
  const saved = window.localStorage.getItem(checklistStorageKey);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as SavedChecklist;
  } catch {
    return null;
  }
}
