import { supabase } from "@/lib/supabase/client";
import type { ChecklistTask, UserProfile } from "@/src/data/checklistRules";
import type { SavedChecklist, SavedChecklistTask } from "@/src/lib/checklistStorage";
import { captureSafeException, captureSafeMessage } from "@/src/lib/monitoring";

type UserTaskRow = {
  checklist_task_id: string;
  title: string;
  category: string;
  description: string;
  priority: "high" | "medium" | "low";
  due_offset_days: number;
  completed: boolean;
  notes: string;
};

export async function getCurrentUserId() {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    captureSafeException(error, {
      feature: "supabase",
      operation: "get-current-user",
    });
    return null;
  }

  return data.user?.id ?? null;
}

export async function saveChecklistToSupabase(
  profile: UserProfile,
  tasks: SavedChecklistTask[],
) {
  if (!supabase) {
    return;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    country: profile.country,
    purpose: profile.purpose,
    city: profile.city,
    stage: profile.stage,
    arrival_date: profile.arrivalDate,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    captureSafeException(profileError, {
      feature: "supabase",
      operation: "save-profile",
    });
    return;
  }

  const { error: tasksError } = await supabase.from("user_tasks").upsert(
    tasks.map((task) => ({
      user_id: userId,
      checklist_task_id: task.id,
      title: task.title,
      category: task.category,
      description: task.description,
      priority: task.priority,
      due_offset_days: task.dueOffsetDays,
      completed: task.completed,
      notes: task.notes,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "user_id,checklist_task_id" },
  );

  if (tasksError) {
    captureSafeException(tasksError, {
      feature: "supabase",
      operation: "save-user-tasks",
    });
  }
}

export async function loadChecklistFromSupabase(): Promise<SavedChecklist | null> {
  if (!supabase) {
    return null;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  const [
    { data: profile, error: profileError },
    { data: tasks, error: tasksError },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase
      .from("user_tasks")
      .select(
        "checklist_task_id,title,category,description,priority,due_offset_days,completed,notes",
      )
      .eq("user_id", userId)
      .order("category", { ascending: true }),
  ]);

  if (profileError || tasksError) {
    captureSafeMessage("Supabase checklist load failed", {
      feature: "supabase",
      operation: "load-checklist",
    });
    return null;
  }

  if (!profile || !tasks) {
    return null;
  }

  return {
    profile: {
      country: profile.country,
      purpose: profile.purpose,
      city: profile.city,
      stage: profile.stage,
      arrivalDate: profile.arrival_date,
    },
    tasks: tasks.map(mapUserTaskRow),
  };
}

export async function updateUserTaskInSupabase(
  taskId: string,
  updates: Pick<SavedChecklistTask, "completed" | "notes">,
) {
  if (!supabase) {
    return;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return;
  }

  const { error } = await supabase
    .from("user_tasks")
    .update({
      completed: updates.completed,
      notes: updates.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("checklist_task_id", taskId);

  if (error) {
    captureSafeException(error, {
      feature: "supabase",
      operation: "update-user-task",
    });
  }
}

// Kept separate so checklist_tasks can become the database source later.
export function mapChecklistRuleToUserTask(task: ChecklistTask): SavedChecklistTask {
  return {
    ...task,
    completed: false,
    notes: "",
  };
}

function mapUserTaskRow(row: UserTaskRow): SavedChecklistTask {
  return {
    id: row.checklist_task_id,
    title: row.title,
    category: row.category,
    description: row.description,
    priority: row.priority,
    dueOffsetDays: row.due_offset_days,
    appliesToCountries: [],
    appliesToPurposes: [],
    appliesToStages: [],
    appliesToCities: [],
    completed: row.completed,
    notes: row.notes,
  };
}
