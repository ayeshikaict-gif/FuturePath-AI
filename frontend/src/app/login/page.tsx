"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, AlertCircle, Sparkles, Mail, CheckCircle2, RotateCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const { login, verifyEmail, resendCode } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unverified email handling
  const [isUnverified, setIsUnverified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e?: React.FormEvent, customCreds?: { email: string; password: string }) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    const loginData = customCreds || { email: email.trim(), password };

    try {
      await login(loginData);
      showToast("Signed in successfully. Welcome back!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err.message || "Failed to sign in. Please verify your credentials.";
      setError(msg);

      if (msg.toLowerCase().includes("not yet verified") || msg.toLowerCase().includes("verification code")) {
        setIsUnverified(true);
      }
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await verifyEmail({
        email: email.trim(),
        code: verificationCode.trim(),
      });
      showToast("Email verified successfully! Signed in.", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
      showToast("Verification failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await resendCode(email.trim());
      if (res?.preview_code) setPreviewCode(res.preview_code);
      showToast("A new verification code was sent to your email.", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to resend code", "error");
    } finally {
      setResending(false);
    }
  };

  const handleInstantDemoLogin = async () => {
    const demoData = {
      email: "student@futurepath.edu",
      password: "FuturePath2026!",
    };
    setEmail(demoData.email);
    setPassword(demoData.password);
    setIsUnverified(false);
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
        <h2 className="text-2xl font-bold text-navy tracking-tight">
          {isUnverified ? "Verify Your Email" : "Sign in to your account"}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {isUnverified
            ? `Enter the 6-digit code sent to ${email}`
            : "Access your personalized career intelligence workspace"}
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

          {!isUnverified ? (
            /* STANDARD LOGIN FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu or gmail.com"
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
          ) : (
            /* UNVERIFIED EMAIL PROMPT */
            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-2">
                  <Mail className="w-5 h-5" />
                </div>
                <p className="text-xs text-muted">
                  Your account requires email verification before signing in. A 6-digit code was sent to <span className="font-semibold text-navy">{email}</span>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5 text-center">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full py-2.5 text-center text-xl font-mono tracking-[0.4em] rounded-lg border-2 border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white text-navy"
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={verificationCode.length !== 6}
                className="w-full"
                size="md"
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Verify & Sign In
              </Button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setIsUnverified(false)}
                  className="text-muted hover:text-navy"
                >
                  &larr; Back to password
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-primary hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Resend code</span>
                </button>
              </div>
            </form>
          )}

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
              Instantly signs in as Kavindu Perera (student@futurepath.edu)
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
