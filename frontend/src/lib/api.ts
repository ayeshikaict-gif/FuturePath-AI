// In browser, using relative /api/v1 uses Next.js server proxy rewrite to http://127.0.0.1:8000/api/v1
// This completely avoids any CORS issues or port conflicts!
const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "/api/v1";
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("futurepath_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("futurepath_token", token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("futurepath_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Do not set Content-Type if body is FormData (browser will set multipart boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const url = `${getApiBase()}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || "";
    } catch {
      // Body is not JSON
    }
    if (!errorDetail) {
      errorDetail = response.statusText ? `${response.status}: ${response.statusText}` : `Request failed with HTTP ${response.status}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  auth: {
    login: (credentials: any) =>
      request<{ access_token: string; token_type: string; user: any }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    register: (userData: any) =>
      request<{ access_token: string; token_type: string; user: any }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getMe: () => request<any>("/auth/me"),
    updateProfile: (profile: any) =>
      request<any>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      }),
    onboarding: (data: any) =>
      request<any>("/auth/onboarding", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    deleteAccount: () =>
      request<any>("/auth/account", {
        method: "DELETE",
      }),
  },

  // Digital Twin
  digitalTwin: {
    get: () => request<any>("/digital-twin"),
    getSkills: () => request<any[]>("/digital-twin/skills"),
    addEvidence: (evidence: any) =>
      request<any>("/digital-twin/evidence", {
        method: "POST",
        body: JSON.stringify(evidence),
      }),
    deleteEvidence: (id: number) =>
      request<any>(`/digital-twin/evidence/${id}`, {
        method: "DELETE",
      }),
  },

  // Career Advisor
  careerAdvisor: {
    getProfiles: () => request<any[]>("/career-advisor/profiles"),
    getProfile: (slug: string) => request<any>(`/career-advisor/profiles/${slug}`),
    match: (slug: string) => request<any>(`/career-advisor/match/${slug}`),
    setGoal: (career_slug: string) =>
      request<any>("/career-advisor/set-goal", {
        method: "POST",
        body: JSON.stringify({ career_slug }),
      }),
  },

  // CV Analyzer
  cv: {
    upload: (formData: FormData) =>
      request<any>("/cv/upload", {
        method: "POST",
        body: formData,
      }),
    list: () => request<any[]>("/cv/list"),
    getAnalysis: (id: number) => request<any>(`/cv/analyses/${id}`),
  },

  // Learning Roadmap
  roadmap: {
    getActive: () => request<any>("/roadmap/active"),
    generate: (careerSlug: string) =>
      request<any>(`/roadmap/generate?career_slug=${encodeURIComponent(careerSlug)}`, {
        method: "POST",
      }),
    toggleTask: (taskId: number, is_completed: boolean) =>
      request<any>(`/roadmap/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ is_completed }),
      }),
  },

  // Lecture Intelligence
  lectures: {
    upload: (data: { title: string; subject?: string; raw_content: string }) =>
      request<any>("/lectures/upload", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    list: () => request<any[]>("/lectures"),
    getDetail: (id: number) => request<any>(`/lectures/${id}`),
  },

  // Opportunity Intelligence
  opportunities: {
    list: (params: { q?: string; opp_type?: string; sri_lanka_only?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params.q) searchParams.append("q", params.q);
      if (params.opp_type && params.opp_type !== "All") searchParams.append("opp_type", params.opp_type);
      if (params.sri_lanka_only !== undefined) searchParams.append("sri_lanka_only", String(params.sri_lanka_only));
      return request<any[]>(`/opportunities?${searchParams.toString()}`);
    },
    toggleBookmark: (id: number) =>
      request<any>(`/opportunities/${id}/bookmark`, {
        method: "POST",
      }),
    updateApplication: (id: number, status: string, notes?: string) =>
      request<any>(`/opportunities/${id}/apply`, {
        method: "POST",
        body: JSON.stringify({ status, notes }),
      }),
    sync: () =>
      request<any>("/opportunities/sync", {
        method: "POST",
      }),
    getMyTracker: () => request<any>("/opportunities/my-tracker"),
  },

  // Simulator
  simulator: {
    evaluate: (data: { target_career_slug: string; skills_to_add: string[] }) =>
      request<any>("/simulator/evaluate", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // Portfolio
  portfolio: {
    get: () => request<any>("/portfolio"),
    togglePublish: () =>
      request<any>("/portfolio/publish", {
        method: "POST",
      }),
    getPublic: (userId: number) => request<any>(`/portfolio/public/${userId}`),
  },

  // Dashboard Summary
  dashboard: {
    getSummary: () => request<any>("/dashboard/summary"),
  },
};
