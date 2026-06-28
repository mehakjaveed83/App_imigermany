"use client";

import { useState } from "react";
import type { UserProfile } from "@/src/data/checklistRules";
import { captureSafeException, captureSafeMessage } from "@/src/lib/monitoring";

type AiExplanation = {
  simpleExplanation: string;
  whyItMatters: string;
  stepsToComplete: string[];
  commonMistakes: string[];
  officialSourceReminder: string | null;
};

type TaskCardProps = {
  id: string;
  title: string;
  category: string;
  description: string;
  dueText: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  notes: string;
  userProfile: UserProfile;
  onToggle: () => void;
  onNotesChange: (notes: string) => void;
};

export function TaskCard({
  id,
  title,
  category,
  description,
  dueText,
  priority,
  completed,
  notes,
  userProfile,
  onToggle,
  onNotesChange,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [explanation, setExplanation] = useState<AiExplanation | null>(null);
  const [aiError, setAiError] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);
  const notesId = `${id}-notes`;
  const questionId = `${id}-ai-question`;

  async function explainTask() {
    setIsExpanded(true);
    setIsExplaining(true);
    setAiError("");

    try {
      const response = await fetch("/api/ai/explain-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskTitle: title,
          taskDescription: description,
          userProfile,
          userQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        captureSafeMessage("AI explanation request failed", {
          feature: "frontend",
          operation: "explain-task",
          status: response.status,
        });
        setAiError(data.error || "Unable to explain this task right now.");
        return;
      }

      if (!data.explanation) {
        captureSafeMessage("AI explanation response missing body", {
          feature: "frontend",
          operation: "explain-task",
        });
        setAiError("The AI returned an empty explanation.");
        return;
      }

      setExplanation(data.explanation);
    } catch (error) {
      captureSafeException(error, {
        feature: "frontend",
        operation: "explain-task",
      });
      setAiError("Unable to reach the AI explanation service.");
    } finally {
      setIsExplaining(false);
    }
  }

  return (
    <article className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <input
          aria-label={completed ? `Mark ${title} incomplete` : `Mark ${title} complete`}
          checked={completed}
          className="mt-1 h-5 w-5 shrink-0 rounded border-line text-forest focus:ring-forest"
          onChange={onToggle}
          type="checkbox"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">
              {category}
            </p>
            <span className="rounded-full bg-[#f1eee6] px-2 py-1 text-xs font-semibold text-muted">
              {priority} priority
            </span>
          </div>

          <h3
            className={`mt-1 text-lg font-semibold text-ink ${
              completed ? "line-through decoration-forest/60" : ""
            }`}
          >
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted">{dueText}</p>

          <button
            aria-expanded={isExpanded}
            className="mt-4 text-sm font-semibold text-forest underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            {isExpanded ? "Hide details" : "View details and notes"}
          </button>

          <button
            className="ml-4 mt-4 text-sm font-semibold text-forest underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
            disabled={isExplaining}
            onClick={explainTask}
            type="button"
          >
            {isExplaining ? "Explaining..." : "Explain this task"}
          </button>

          {isExpanded ? (
            <div className="mt-4 border-t border-line pt-4">
              <p className="text-sm leading-6 text-muted">{description}</p>

              <label className="mt-4 block" htmlFor={notesId}>
                <span className="mb-2 block text-sm font-medium text-ink">
                  Notes for this task
                </span>
                <textarea
                  className="min-h-28 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-forest focus:ring-2 focus:ring-forest/20"
                  id={notesId}
                  onChange={(event) => onNotesChange(event.target.value)}
                  placeholder="Add appointment dates, document reminders, links, or personal notes."
                  value={notes}
                />
              </label>

              <label className="mt-4 block" htmlFor={questionId}>
                <span className="mb-2 block text-sm font-medium text-ink">
                  Optional question for AI
                </span>
                <textarea
                  className="min-h-20 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-forest focus:ring-2 focus:ring-forest/20"
                  id={questionId}
                  onChange={(event) => setUserQuestion(event.target.value)}
                  placeholder="Example: What should I prepare first?"
                  value={userQuestion}
                />
              </label>

              {aiError ? (
                <p className="mt-4 rounded-md border border-line bg-[#fbfaf7] px-4 py-3 text-sm text-coral">
                  {aiError}
                </p>
              ) : null}

              {explanation ? (
                <div className="mt-4 rounded-lg border border-line bg-[#fbfaf7] p-4">
                  <h4 className="text-base font-semibold text-ink">AI explanation</h4>

                  <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
                    <section>
                      <h5 className="font-semibold text-ink">Simple explanation</h5>
                      <p>{explanation.simpleExplanation}</p>
                    </section>

                    <section>
                      <h5 className="font-semibold text-ink">Why it matters</h5>
                      <p>{explanation.whyItMatters}</p>
                    </section>

                    {explanation.stepsToComplete.length > 0 ? (
                      <section>
                        <h5 className="font-semibold text-ink">Steps to complete it</h5>
                        <ol className="mt-2 list-decimal space-y-1 pl-5">
                          {explanation.stepsToComplete.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </section>
                    ) : null}

                    {explanation.commonMistakes.length > 0 ? (
                      <section>
                        <h5 className="font-semibold text-ink">Common mistakes</h5>
                        <ul className="mt-2 list-disc space-y-1 pl-5">
                          {explanation.commonMistakes.map((mistake) => (
                            <li key={mistake}>{mistake}</li>
                          ))}
                        </ul>
                      </section>
                    ) : null}

                    {explanation.officialSourceReminder ? (
                      <section className="rounded-md border border-line bg-white p-3">
                        <h5 className="font-semibold text-ink">
                          Official-source reminder
                        </h5>
                        <p>{explanation.officialSourceReminder}</p>
                      </section>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
