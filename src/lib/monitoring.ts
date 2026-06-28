import * as Sentry from "@sentry/nextjs";

type MonitoringContext = {
  feature: "ai" | "supabase" | "frontend";
  operation: string;
  status?: number | string;
};

export function captureSafeException(error: unknown, context: MonitoringContext) {
  Sentry.captureException(error, {
    tags: {
      feature: context.feature,
      operation: context.operation,
      status: context.status ? String(context.status) : "unknown",
    },
  });
}

export function captureSafeMessage(message: string, context: MonitoringContext) {
  Sentry.captureMessage(message, {
    level: "warning",
    tags: {
      feature: context.feature,
      operation: context.operation,
      status: context.status ? String(context.status) : "unknown",
    },
  });
}
