"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent, customCreds?: { email: string; password: string }) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    const loginData = customCreds || { email, password };

    try {
      await login(loginData);
      showToast("Signed in successfully. Welcome back!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
      showToast("Sign in failed. Please check your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    const demoData = {
      email: "student@futurepath.edu",
      password: "FuturePath2026!",
    };
    setEmail(demoData.email);
    setPassword(demoData.password);
    await handleSubmit(undefined, demoData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Compass className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-navy">FuturePath</span>
          <span className="text-xl font-light text-primary">AI</span>
        </Link>
        <h2 className="text-2xl font-bold text-navy tracking-tight">Sign in to your account</h2>
        <p className="mt-1 text-xs text-muted">Access your personalized career intelligence workspace</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 rounded-lg bg-error-light border border-[#FAD3D3] text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">University Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-navy">Password</label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
              />
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-2" size="md">
              Sign In
            </Button>
          </form>

          {/* Instant Demo Account Autofill and 1-Click Login */}
          <div className="mt-6 pt-5 border-t border-border">
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-primary/20 bg-primary-light text-primary hover:bg-[#deebff] text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>1-Click Sign In with Demo Account (Kavindu)</span>
            </button>
            <p className="text-[11px] text-muted text-center mt-2">
              Instantly signs in as Kavindu Perera (3rd Year Software Engineering)
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
