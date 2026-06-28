import { LoginForm } from "@/components/LoginForm";
import { PageHeader } from "@/components/PageHeader";

export default function LoginPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-10">
      <PageHeader
        eyebrow="Login"
        title="Save your checklist progress."
        description="Use email and password authentication through Supabase. You can still use the checklist locally without logging in."
      />

      <LoginForm />
    </main>
  );
}
