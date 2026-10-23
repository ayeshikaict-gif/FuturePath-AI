"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, AlertCircle, Sparkles, User, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    e?: React.FormEvent,
    customCreds?: { email: string; password: string }
  ) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    const loginData = customCreds || { email: identifier.trim(), password };

    try {
      await login(loginData);
      showToast("Signed in successfully. Welcome back!", "success");

      // Check onboarding state from localStorage if available
      try {
        const storedMe = localStorage.getItem("futurepath_token");
        if (storedMe && storedMe.includes("onboarding_completed:false")) {
          router.push("/onboarding");
          return;
        }
      } catch {
        // ignore
      }

      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Failed to sign in. Please check your credentials.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    const demoData = {
      email: "student@futurepath.edu",
      password: "FuturePath2026!",
    };
    setIdentifier(demoData.email);
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
        <p className="mt-1 text-xs text-muted">
          Access your personalized career intelligence workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Card className="p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-error-light border border-[#FAD3D3] text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-navy mb-1.5">
                Username or Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. sgsayeshika@gmail.com or ayeshika"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
                <User className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-navy">Password</label>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-muted absolute left-3 top-2.5" />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-2"
              size="md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
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
              <span>1-Click Sign In with Demo Account</span>
            </button>
            <p className="text-[11px] text-muted text-center mt-2">
              Instantly signs in as Alex Morgan (student@futurepath.edu)
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
