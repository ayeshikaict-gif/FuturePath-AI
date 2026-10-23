"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  AlertCircle,
  ArrowRight,
  Mail,
  CheckCircle2,
  KeyRound,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  RotateCw,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const SRI_LANKAN_UNIVERSITIES = [
  "University of Colombo - School of Computing (UCSC)",
  "University of Moratuwa",
  "Sri Lanka Institute of Information Technology (SLIIT)",
  "Informatics Institute of Technology (IIT)",
  "National School of Business Management (NSBM)",
  "University of Kelaniya",
  "University of Peradeniya",
  "Other Institution",
];

const DEGREE_PROGRAMS = [
  "B.Sc. in Computer Science",
  "B.Sc. in Software Engineering",
  "B.Sc. in Information Technology",
  "B.Sc. in Data Science / AI",
  "B.Sc. in Computer Systems & Networking",
  "B.Sc. in Information Systems",
  "Other Degree",
];

const ACADEMIC_YEARS = [
  "1st Year (Freshman)",
  "2nd Year (Sophomore)",
  "3rd Year (Junior)",
  "4th Year (Senior / Final Year)",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, verifyEmail, resendCode } = useAuth();
  const { showToast } = useToast();

  // Wizard state: 1 = Details, 2 = Email Verification
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState(SRI_LANKAN_UNIVERSITIES[0]);
  const [degree, setDegree] = useState(DEGREE_PROGRAMS[0]);
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[2]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verification state
  const [verificationCode, setVerificationCode] = useState("");
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Submit Details & Trigger Verification Code
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter identical passwords.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        institution,
        degree,
        academic_year: academicYear,
      });

      if (res?.requires_verification) {
        setPreviewCode(res.preview_code || null);
        setStep(2);
        showToast(`Verification code sent to ${email.trim()}!`, "info");
      } else {
        showToast("Account created successfully!", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check the details and try again.");
      showToast(err.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Verification Code
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (verificationCode.trim().length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      await verifyEmail({
        email: email.trim(),
        code: verificationCode.trim(),
      });
      showToast("Email verified successfully! Welcome to FuturePath AI.", "success");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
      showToast("Verification failed. Please check the code.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend Code handler
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setError(null);

    try {
      const res = await resendCode(email.trim());
      if (res?.preview_code) {
        setPreviewCode(res.preview_code);
      }
      showToast("A new 6-digit verification code was sent to your email.", "info");

      // Cooldown 30s
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code.");
    }
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
          {step === 1 ? "Create Your Student Account" : "Verify Your Email Address"}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {step === 1
            ? "Enter your academic credentials to start your personalized career intelligence"
            : `Enter the 6-digit code sent to ${email}`}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? "bg-primary text-white" : "bg-success text-white"}`}>
              {step > 1 ? "✓" : "1"}
            </span>
            <span className={step === 1 ? "text-navy font-bold" : "text-muted"}>Academic Details</span>
          </div>
          <div className="w-8 h-[1px] bg-border" />
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? "bg-primary text-white" : "bg-[#E2E8F0] text-muted"}`}>
              2
            </span>
            <span className={step === 2 ? "text-navy font-bold" : "text-muted"}>Email Code</span>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card className="p-8 shadow-card">
          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-lg bg-error-light border border-[#FAD3D3] text-xs text-error">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: REGISTRATION FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Kavindu Perera"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">
                  Email Address <span className="text-muted font-normal">(Verification code will be sent here)</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu or gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Institution / University</label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  >
                    {SRI_LANKAN_UNIVERSITIES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  >
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy mb-1.5">Degree Program</label>
                <select
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-white text-navy focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                >
                  {DEGREE_PROGRAMS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Create Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white text-navy placeholder:text-muted/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full mt-4"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Send Verification Code & Continue
              </Button>
            </form>
          ) : (
            /* STEP 2: EMAIL VERIFICATION CODE */
            <form onSubmit={handleVerifySubmit} className="space-y-5">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-navy">Check Your Email Inbox</h3>
                <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                  We sent a 6-digit confirmation code to{" "}
                  <span className="font-semibold text-navy">{email}</span>.
                </p>
              </div>

              {/* Instant Auto-Fill Banner for Development & Demonstration */}
              {previewCode && (
                <div className="p-3.5 rounded-lg bg-[#EDF3FF] border border-[#CBDDFE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-navy">Demonstration Code: </span>
                      <span className="font-mono font-bold text-primary tracking-wider text-sm">
                        {previewCode}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVerificationCode(previewCode)}
                    className="text-xs text-primary font-bold hover:underline self-end sm:self-center"
                  >
                    Click to Auto-fill &rarr;
                  </button>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="w-full py-3 text-center text-2xl font-mono tracking-[0.5em] rounded-lg border-2 border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-white text-navy transition-all"
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
                Verify Email & Finish Registration
              </Button>

              <div className="flex items-center justify-between pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-muted hover:text-navy flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit details / email</span>
                </button>

                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendCode}
                  className={`flex items-center gap-1 font-semibold ${
                    resendCooldown > 0
                      ? "text-muted cursor-not-allowed"
                      : "text-primary hover:underline"
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-muted pt-4 border-t border-border">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
