import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  sendDefaultPii: false,
  beforeSend(event) {
    return scrubSentryEvent(event);
  },
});

function scrubSentryEvent(event: Sentry.ErrorEvent) {
  delete event.user;
  delete event.request?.cookies;
  delete event.request?.headers;
  delete event.request?.data;

  if (event.extra) {
    delete event.extra.notes;
    delete event.extra.userProfile;
    delete event.extra.taskDescription;
    delete event.extra.userQuestion;
    delete event.extra.apiKey;
  }

  return event;
}
