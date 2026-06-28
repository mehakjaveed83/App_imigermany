"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { ProgressBar } from "@/components/ProgressBar";
import { TaskCard } from "@/components/TaskCard";
import {
  loadChecklist,
  saveChecklist,
  type SavedChecklistTask,
  type SavedChecklist,
} from "@/src/lib/checklistStorage";
import {
  loadChecklistFromSupabase,
  updateUserTaskInSupabase,
} from "@/src/lib/supabaseChecklist";

function formatProfileValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDueText(arrivalDate: string, dueOffsetDays: number) {
  const dueDate = new Date(`${arrivalDate}T00:00:00`);
  dueDate.setDate(dueDate.getDate() + dueOffsetDays);

  return `Target date: ${dueDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

export function DashboardChecklist() {
  const [savedChecklist, setSavedChecklist] = useState<SavedChecklist | null>(null);

  useEffect(() => {
    async function loadChecklistData() {
      const checklist = (await loadChecklistFromSupabase()) ?? loadChecklist();

      if (!checklist) {
        return;
      }

      // Older local checklists may not have notes yet.
      const checklistWithNotes = {
        ...checklist,
        tasks: checklist.tasks.map((task) => ({
          ...task,
          notes: task.notes ?? "",
        })),
      };

      setSavedChecklist(checklistWithNotes);
      saveChecklist(checklistWithNotes);
    }

    loadChecklistData();
  }, []);

  function updateTasks(updater: (tasks: SavedChecklistTask[]) => SavedChecklistTask[]) {
    if (!savedChecklist) {
      return;
    }

    const nextChecklist = {
      ...savedChecklist,
      tasks: updater(savedChecklist.tasks),
    };

    setSavedChecklist(nextChecklist);
    saveChecklist(nextChecklist);
  }

  async function toggleTask(taskId: string) {
    const nextTask = savedChecklist?.tasks.find((task) => task.id === taskId);

    updateTasks((tasks) =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );

    if (nextTask) {
      await updateUserTaskInSupabase(taskId, {
        completed: !nextTask.completed,
        notes: nextTask.notes,
      });
    }
  }

  async function updateTaskNotes(taskId: string, notes: string) {
    const nextTask = savedChecklist?.tasks.find((task) => task.id === taskId);

    updateTasks((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, notes } : task)),
    );

    if (nextTask) {
      await updateUserTaskInSupabase(taskId, {
        completed: nextTask.completed,
        notes,
      });
    }
  }

  if (!savedChecklist) {
    return (
      <section className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-ink">No checklist yet</h2>
        <p className="mt-2 text-muted">
          Answer the onboarding questions first so GermanyMove can generate your
          starter checklist.
        </p>
        <div className="mt-5">
          <Button href="/onboarding">Start onboarding</Button>
        </div>
      </section>
    );
  }

  const completedTasks = savedChecklist.tasks.filter((task) => task.completed).length;
  const { profile } = savedChecklist;
  const groupedTasks = savedChecklist.tasks.reduce<Record<string, SavedChecklistTask[]>>(
    (groups, task) => {
      const categoryTasks = groups[task.category] ?? [];
      return {
        ...groups,
        [task.category]: [...categoryTasks, task],
      };
    },
    {},
  );

  return (
    <>
      <section className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm">
        <div className="mb-5 grid gap-3 text-sm text-muted md:grid-cols-5">
          <span>Country: {formatProfileValue(profile.country)}</span>
          <span>Purpose: {formatProfileValue(profile.purpose)}</span>
          <span>City: {formatProfileValue(profile.city)}</span>
          <span>Stage: {formatProfileValue(profile.stage)}</span>
          <span>Arrival: {profile.arrivalDate}</span>
        </div>
        <ProgressBar value={completedTasks} max={savedChecklist.tasks.length} />
      </section>

      <section className="mt-6 grid gap-6">
        {Object.entries(groupedTasks).map(([category, tasks]) => (
          <div key={category}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-ink">{category}</h2>
              <span className="text-sm text-muted">
                {tasks.filter((task) => task.completed).length} of {tasks.length} done
              </span>
            </div>
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  category={task.category}
                  completed={task.completed}
                  description={task.description}
                  dueText={getDueText(profile.arrivalDate, task.dueOffsetDays)}
                  id={task.id}
                  key={task.id}
                  notes={task.notes}
                  onNotesChange={(notes) => updateTaskNotes(task.id, notes)}
                  onToggle={() => toggleTask(task.id)}
                  priority={task.priority}
                  title={task.title}
                  userProfile={profile}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
