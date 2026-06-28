"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { supabase } from "@/lib/supabase/client";
import { captureSafeException, captureSafeMessage } from "@/src/lib/monitoring";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAuth(mode: "sign-in" | "sign-up", formData: FormData) {
    if (!supabase) {
      captureSafeMessage("Supabase client missing during auth", {
        feature: "supabase",
        operation: "auth-config",
      });
      setMessage("Add Supabase environment variables before using login.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsLoading(false);

    if (error) {
      captureSafeException(error, {
        feature: "supabase",
        operation: mode,
      });
      setMessage(error.message);
      return;
    }

    if (mode === "sign-up") {
      setMessage("Account created. Check your email if confirmation is enabled.");
      return;
    }

    router.push("/dashboard");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await handleAuth("sign-in", new FormData(event.currentTarget));
  }

  async function handleSignUp() {
    const form = document.querySelector<HTMLFormElement>("#login-form");

    if (!form) {
      return;
    }

    await handleAuth("sign-up", new FormData(form));
  }

  return (
    <form
      className="mt-8 rounded-lg border border-line bg-white p-6 shadow-sm"
      id="login-form"
      onSubmit={handleSubmit}
    >
      <div className="space-y-5">
        <Input label="Email" name="email" placeholder="you@example.com" required type="email" />
        <Input
          label="Password"
          minLength={6}
          name="password"
          placeholder="Enter at least 6 characters"
          required
          type="password"
        />
      </div>

      {message ? (
        <p className="mt-5 rounded-md border border-line bg-[#fbfaf7] px-4 py-3 text-sm text-muted">
          {message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Please wait..." : "Log in"}
        </Button>
        <Button disabled={isLoading} onClick={handleSignUp} type="button" variant="secondary">
          Create account
        </Button>
        <Button href="/" type="button" variant="secondary">
          Back home
        </Button>
      </div>
    </form>
  );
}
