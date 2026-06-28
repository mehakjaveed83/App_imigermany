import { NextResponse } from "next/server";
import { captureSafeException, captureSafeMessage } from "@/src/lib/monitoring";

type ExplainTaskRequest = {
  taskTitle?: string;
  taskDescription?: string;
  userProfile?: {
    country?: string;
    purpose?: string;
    city?: string;
    stage?: string;
    arrivalDate?: string;
  };
  userQuestion?: string;
};

type AiExplanation = {
  simpleExplanation: string;
  whyItMatters: string;
  stepsToComplete: string[];
  commonMistakes: string[];
  officialSourceReminder: string | null;
};

const legalOrVisaKeywords = [
  "visa",
  "residence permit",
  "anmeldung",
  "registration",
  "immigration",
];

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const defaultModel = process.env.OPENAI_DEFAULT_MODEL;
  const escalationModel = process.env.OPENAI_ESCALATION_MODEL;

  if (!apiKey) {
    captureSafeMessage("Missing OpenAI API key", {
      feature: "ai",
      operation: "explain-task-config",
      status: 500,
    });
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on the server." },
      { status: 500 },
    );
  }

  if (!defaultModel) {
    captureSafeMessage("Missing OpenAI default model", {
      feature: "ai",
      operation: "explain-task-config",
      status: 500,
    });
    return NextResponse.json(
      { error: "Missing OPENAI_DEFAULT_MODEL on the server." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as ExplainTaskRequest;

  if (!body.taskTitle || !body.taskDescription || !body.userProfile) {
    return NextResponse.json(
      { error: "Task title, task description, and user profile are required." },
      { status: 400 },
    );
  }

  const isLegalOrVisaRelated = legalOrVisaKeywords.some((keyword) => {
    const text = `${body.taskTitle} ${body.taskDescription}`.toLowerCase();
    return text.includes(keyword);
  });
  const model = isLegalOrVisaRelated && escalationModel ? escalationModel : defaultModel;

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "developer",
            content:
              "You explain Germany relocation tasks in simple English for newcomers from India, Pakistan, and Bangladesh. Do not give legal advice. If a task involves visa, residence permit, Anmeldung, immigration, or official paperwork, remind the user to verify details with the official German authority or German mission website. Return only valid JSON.",
          },
          {
            role: "user",
            content: JSON.stringify({
              taskTitle: body.taskTitle,
              taskDescription: body.taskDescription,
              userProfile: body.userProfile,
              userQuestion: body.userQuestion || "",
              requiredOutput: {
                simpleExplanation: "short plain-English explanation",
                whyItMatters: "why this task matters",
                stepsToComplete: ["3 to 6 practical steps"],
                commonMistakes: ["2 to 5 common mistakes"],
                officialSourceReminder:
                  "official-source reminder if legal or visa related, otherwise null",
              },
            }),
          },
        ],
        max_output_tokens: 900,
      }),
    });

    if (openAiResponse.status === 429) {
      captureSafeMessage("OpenAI rate limit", {
        feature: "ai",
        operation: "explain-task-openai",
        status: 429,
      });
      return NextResponse.json(
        { error: "The AI service is rate limited. Please try again soon." },
        { status: 429 },
      );
    }

    if (!openAiResponse.ok) {
      await openAiResponse.text();
      captureSafeMessage("OpenAI model error", {
        feature: "ai",
        operation: "explain-task-openai",
        status: openAiResponse.status,
      });
      return NextResponse.json(
        { error: "The AI model returned an error." },
        { status: 502 },
      );
    }

    const responseJson = await openAiResponse.json();
    const outputText = extractOutputText(responseJson);

    if (!outputText) {
      captureSafeMessage("OpenAI empty response", {
        feature: "ai",
        operation: "explain-task-openai",
        status: 502,
      });
      return NextResponse.json(
        { error: "The AI model returned an empty response." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      explanation: parseExplanation(outputText, isLegalOrVisaRelated),
      model,
    });
  } catch (error) {
    captureSafeException(error, {
      feature: "ai",
      operation: "explain-task",
      status: 500,
    });
    return NextResponse.json(
      {
        error: "Unable to generate an explanation right now.",
      },
      { status: 500 },
    );
  }
}

function extractOutputText(responseJson: unknown) {
  if (
    typeof responseJson === "object" &&
    responseJson !== null &&
    "output_text" in responseJson &&
    typeof responseJson.output_text === "string"
  ) {
    return responseJson.output_text.trim();
  }

  if (
    typeof responseJson === "object" &&
    responseJson !== null &&
    "output" in responseJson &&
    Array.isArray(responseJson.output)
  ) {
    return responseJson.output
      .flatMap((item) => {
        if (!item || typeof item !== "object" || !("content" in item)) {
          return [];
        }

        const content = item.content;
        if (!Array.isArray(content)) {
          return [];
        }

        return content
          .filter(
            (part) =>
              part &&
              typeof part === "object" &&
              "type" in part &&
              part.type === "output_text" &&
              "text" in part &&
              typeof part.text === "string",
          )
          .map((part) => part.text);
      })
      .join("\n")
      .trim();
  }

  return "";
}

function parseExplanation(
  outputText: string,
  isLegalOrVisaRelated: boolean,
): AiExplanation {
  try {
    const parsed = JSON.parse(outputText) as Partial<AiExplanation>;
    return {
      simpleExplanation: parsed.simpleExplanation || outputText,
      whyItMatters: parsed.whyItMatters || "This task helps keep your move organized.",
      stepsToComplete: Array.isArray(parsed.stepsToComplete)
        ? parsed.stepsToComplete
        : [],
      commonMistakes: Array.isArray(parsed.commonMistakes)
        ? parsed.commonMistakes
        : [],
      officialSourceReminder:
        parsed.officialSourceReminder ||
        (isLegalOrVisaRelated
          ? "Please verify visa, residence, registration, or legal requirements with the official German authority or German mission website."
          : null),
    };
  } catch {
    return {
      simpleExplanation: outputText,
      whyItMatters: "This task helps keep your move organized.",
      stepsToComplete: [],
      commonMistakes: [],
      officialSourceReminder: isLegalOrVisaRelated
        ? "Please verify visa, residence, registration, or legal requirements with the official German authority or German mission website."
        : null,
    };
  }
}
