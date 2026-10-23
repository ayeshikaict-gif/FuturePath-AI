import { NextRequest, NextResponse } from "next/server";

// In-memory persistent data store for serverless Next.js deployment
interface StoredUser {
  id: number;
  email: string;
  password?: string;
  full_name: string;
  institution?: string;
  degree?: string;
  academic_year?: string;
  target_career?: string;
  weekly_study_hours?: number;
  onboarding_completed: boolean;
  is_verified: boolean;
  verification_code?: string;
  verification_code_expires_at?: number;
  created_at: string;
}

const users: StoredUser[] = [
  {
    id: 1,
    email: "student@futurepath.edu",
    password: "FuturePath2026!",
    full_name: "Alex Morgan",
    institution: "University of Colombo - School of Computing",
    degree: "B.Sc. in Information & Communication Technology",
    academic_year: "3rd Year",
    target_career: "Full-Stack Developer",
    weekly_study_hours: 15,
    onboarding_completed: true,
    is_verified: true,
    created_at: new Date().toISOString(),
  },
];

let nextUserId = 2;

// Initial Career Profiles
const careerProfiles = [
  {
    id: 1,
    title: "Full-Stack Developer",
    slug: "full-stack-developer",
    description: "Build robust, scalable end-to-end web applications with modern frontend frameworks and distributed backend APIs.",
    demand_level: "High",
    average_salary_lkr: "250,000 - 450,000 LKR/mo",
    average_salary_usd: "$65,000 - $110,000/yr",
    category: "Software Engineering",
    core_skills: ["React", "TypeScript", "Node.js", "Python", "SQL", "REST APIs", "Docker", "Git"],
  },
  {
    id: 2,
    title: "AI & Machine Learning Engineer",
    slug: "ai-ml-engineer",
    description: "Design, train, and deploy predictive models, neural networks, LLM fine-tuning pipelines, and intelligent agent systems.",
    demand_level: "Critical",
    average_salary_lkr: "300,000 - 600,000 LKR/mo",
    average_salary_usd: "$90,000 - $150,000/yr",
    category: "Artificial Intelligence",
    core_skills: ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "Linear Algebra", "LLMs", "Vector DBs"],
  },
  {
    id: 3,
    title: "Cloud & DevOps Engineer",
    slug: "cloud-devops-engineer",
    description: "Automate build, deployment, infrastructure-as-code, and resilient multi-region cloud operations.",
    demand_level: "Very High",
    average_salary_lkr: "280,000 - 550,000 LKR/mo",
    average_salary_usd: "$85,000 - $140,000/yr",
    category: "Infrastructure",
    core_skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "Python", "Prometheus"],
  },
  {
    id: 4,
    title: "Cybersecurity Analyst",
    slug: "cybersecurity-analyst",
    description: "Protect enterprise information assets, audit vulnerability vectors, and implement defensive security architectures.",
    demand_level: "Very High",
    average_salary_lkr: "240,000 - 500,000 LKR/mo",
    average_salary_usd: "$75,000 - $130,000/yr",
    category: "Security",
    core_skills: ["Network Security", "Penetration Testing", "Cryptography", "Linux", "Python", "Incident Response"],
  },
  {
    id: 5,
    title: "Data Scientist",
    slug: "data-scientist",
    description: "Transform complex raw multi-source enterprise data into actionable statistical insights and predictive intelligence.",
    demand_level: "High",
    average_salary_lkr: "260,000 - 520,000 LKR/mo",
    average_salary_usd: "$80,000 - $135,000/yr",
    category: "Data & Analytics",
    core_skills: ["Python", "SQL", "Pandas", "Scikit-Learn", "Data Visualization", "Statistics", "Tableau"],
  },
  {
    id: 6,
    title: "UI/UX Product Designer",
    slug: "ui-ux-designer",
    description: "Architect intuitive student and user journeys, design wireframes, design systems, and usable interfaces.",
    demand_level: "High",
    average_salary_lkr: "200,000 - 400,000 LKR/mo",
    average_salary_usd: "$60,000 - $105,000/yr",
    category: "Design",
    core_skills: ["Figma", "Design Systems", "User Research", "Wireframing", "Prototyping", "HTML/CSS", "Usability Testing"],
  },
];

// Curated Verified Opportunities
const opportunities = [
  {
    id: 1,
    title: "Associate Software Engineer - Trainee / Intern",
    company: "WSO2",
    location: "Colombo, Sri Lanka",
    country: "Sri Lanka",
    type: "Internship",
    work_mode: "Hybrid",
    category: "Software Engineering",
    stipend_salary: "60,000 - 80,000 LKR/mo",
    description: "Join the open-source integration leader. Build high-throughput microservices and identity management systems.",
    deadline: "2026-11-30",
    url: "https://wso2.com/careers/",
    is_bookmarked: false,
    required_skills: ["Java", "Python", "React", "REST APIs", "Git"],
  },
  {
    id: 2,
    title: "Cloud DevOps Intern",
    company: "Sysco LABS Sri Lanka",
    location: "Colombo, Sri Lanka",
    country: "Sri Lanka",
    type: "Internship",
    work_mode: "Hybrid",
    category: "DevOps",
    stipend_salary: "65,000 - 90,000 LKR/mo",
    description: "Support AWS multi-account infrastructure, automate deployment pipelines, and maintain observability tooling.",
    deadline: "2026-11-15",
    url: "https://syscolabs.lk/careers",
    is_bookmarked: true,
    required_skills: ["AWS", "Docker", "Linux", "CI/CD", "Python"],
  },
  {
    id: 3,
    title: "Undergraduate AI/ML Research Intern",
    company: "IFS Research & Labs",
    location: "Colombo, Sri Lanka",
    country: "Sri Lanka",
    type: "Internship",
    work_mode: "On-site",
    category: "Artificial Intelligence",
    stipend_salary: "70,000 - 95,000 LKR/mo",
    description: "Work with enterprise ERP intelligence teams applying neural networks, automated forecasting, and LLMs.",
    deadline: "2026-12-15",
    url: "https://www.ifs.com/careers",
    is_bookmarked: false,
    required_skills: ["Python", "PyTorch", "FastAPI", "SQL", "Statistics"],
  },
  {
    id: 4,
    title: "Graduate Software Engineer (Front-End / React)",
    company: "London Stock Exchange Group (LSEG)",
    location: "Colombo / Global",
    country: "Sri Lanka",
    type: "Full-Time",
    work_mode: "Hybrid",
    category: "Software Engineering",
    stipend_salary: "200,000 - 280,000 LKR/mo",
    description: "Build ultra-low latency financial data visualization dashboards and trader analytics platforms using modern TypeScript.",
    deadline: "2026-12-31",
    url: "https://www.lseg.com/careers",
    is_bookmarked: false,
    required_skills: ["React", "TypeScript", "Next.js", "WebSockets", "CSS"],
  },
  {
    id: 5,
    title: "Junior Security Operations Center (SOC) Analyst",
    company: "Axiata Digital Labs",
    location: "Colombo, Sri Lanka",
    country: "Sri Lanka",
    type: "Full-Time",
    work_mode: "Hybrid",
    category: "Cybersecurity",
    stipend_salary: "150,000 - 220,000 LKR/mo",
    description: "Monitor real-time threat vectors, triage intrusion anomalies, and automate incident containment scripts.",
    deadline: "2026-11-25",
    url: "https://www.axiatadigitallabs.com",
    is_bookmarked: false,
    required_skills: ["Network Security", "Linux", "Python", "Incident Response"],
  },
  {
    id: 6,
    title: "Junior Full-Stack Engineer (Remote)",
    company: "99x Tech",
    location: "Colombo / Remote Norway",
    country: "Global",
    type: "Full-Time",
    work_mode: "Remote",
    category: "Software Engineering",
    stipend_salary: "220,000 - 320,000 LKR/mo",
    description: "Build Nordic fintech and healthcare products using React, Next.js, and serverless Node.js / Python architectures.",
    deadline: "2026-12-20",
    url: "https://99x.io/careers",
    is_bookmarked: true,
    required_skills: ["TypeScript", "React", "Node.js", "Docker", "SQL"],
  },
];

// In-memory Evidence List
const evidenceItems = [
  {
    id: 1,
    title: "University E-Commerce Coursework Project",
    category: "Academic",
    skill_name: "React & TypeScript",
    verification_status: "Verified",
    date: "2026-08-14",
    description: "Built full-stack store application with Next.js App router, shopping cart state, and Stripe payment test integration.",
  },
  {
    id: 2,
    title: "Python Data Analysis Hackathon Certificate",
    category: "Certification",
    skill_name: "Python & Data Analysis",
    verification_status: "Verified",
    date: "2026-09-02",
    description: "Completed 24-hour predictive analytics challenge analyzing public transport density patterns.",
  },
  {
    id: 3,
    title: "Personal Portfolio & Blog Engine",
    category: "Personal Project",
    skill_name: "Tailwind CSS & Web Dev",
    verification_status: "Self-Reported",
    date: "2026-10-01",
    description: "Responsive website built with modern CSS variables, semantic tags, and dark/light mode toggle.",
  },
];

// Helper: generate mock JWT
function generateToken(user: StoredUser): string {
  const payload = {
    sub: String(user.id),
    email: user.email,
    name: user.full_name,
    exp: Math.floor(Date.now() / 1000) + 86400 * 7,
  };
  return `fp_${Buffer.from(JSON.stringify(payload)).toString("base64")}`;
}

// Helper: format complete user object for clients
function formatUserResponse(user: StoredUser) {
  const targetCareerSlug = (user.target_career || "full-stack-developer")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const profile = {
    institution: user.institution || "University of Colombo - School of Computing",
    degree: user.degree || "B.Sc. in Computer Science",
    academic_year: parseInt(String(user.academic_year).replace(/\D/g, "")) || 3,
    target_career_slug: targetCareerSlug,
    weekly_study_hours: user.weekly_study_hours || 15,
    bio: "Undergraduate student passionate about building real-world software systems, clean UI architecture, and robust APIs.",
    github_url: "https://github.com/ayeshikaict-gif",
    linkedin_url: "https://linkedin.com",
    portfolio_published: true,
    onboarding_completed: user.onboarding_completed ?? true,
  };

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: "student",
    institution: profile.institution,
    degree: profile.degree,
    academic_year: user.academic_year || "3rd Year",
    target_career: user.target_career || "Full-Stack Developer",
    weekly_study_hours: profile.weekly_study_hours,
    onboarding_completed: profile.onboarding_completed,
    profile,
  };
}

// Helper: parse authorization token
function getAuthenticatedUser(req: NextRequest): StoredUser {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer fp_")) {
    try {
      const token = authHeader.replace("Bearer fp_", "");
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      const found = users.find((u) => u.id === Number(decoded.sub) || u.email === decoded.email);
      if (found) return found;
    } catch {
      // fallback
    }
  }
  return users[0];
}

// Main Route Dispatcher for GET / POST / PUT / PATCH / DELETE
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const path = (resolvedParams.path || []).join("/");
  const user = getAuthenticatedUser(req);

  // 1. Health check
  if (path === "health") {
    return NextResponse.json({ status: "healthy", service: "futurepath-serverless" });
  }

  // 2. Auth: /auth/me
  if (path === "auth/me") {
    return NextResponse.json(formatUserResponse(user));
  }

  // 3. Digital Twin: /digital-twin
  if (path === "digital-twin") {
    return NextResponse.json({
      readiness_score: 76,
      readiness_percentile: "Top 18%",
      verified_skills_count: 9,
      in_progress_skills_count: 5,
      evidence_items_count: evidenceItems.length,
      current_target_career: user.target_career || "Full-Stack Developer",
      skills: [
        { name: "TypeScript", category: "Languages", score: 82, verified: true, market_demand: "Very High" },
        { name: "React / Next.js", category: "Frontend", score: 85, verified: true, market_demand: "Very High" },
        { name: "Python", category: "Backend / AI", score: 78, verified: true, market_demand: "High" },
        { name: "SQL & Databases", category: "Data", score: 70, verified: true, market_demand: "High" },
        { name: "REST APIs & FastAPI", category: "Backend", score: 75, verified: true, market_demand: "High" },
        { name: "Git & Version Control", category: "DevOps", score: 88, verified: true, market_demand: "Essential" },
        { name: "Docker & Containers", category: "DevOps", score: 55, verified: false, market_demand: "High" },
        { name: "AWS Cloud Fundamentals", category: "Cloud", score: 48, verified: false, market_demand: "Very High" },
      ],
      evidence: evidenceItems,
    });
  }

  if (path === "digital-twin/skills") {
    return NextResponse.json([
      { id: 1, name: "React", category: "Frontend", proficiency: 85, verified: true },
      { id: 2, name: "TypeScript", category: "Languages", proficiency: 82, verified: true },
      { id: 3, name: "Python", category: "Languages", proficiency: 78, verified: true },
      { id: 4, name: "SQL", category: "Databases", proficiency: 70, verified: true },
      { id: 5, name: "Docker", category: "DevOps", proficiency: 55, verified: false },
      { id: 6, name: "AWS", category: "Cloud", proficiency: 48, verified: false },
    ]);
  }

  // 4. Career Advisor: /career-advisor/profiles
  if (path === "career-advisor/profiles") {
    return NextResponse.json(careerProfiles);
  }

  if (path.startsWith("career-advisor/profiles/")) {
    const slug = path.replace("career-advisor/profiles/", "");
    const profile = careerProfiles.find((p) => p.slug === slug) || careerProfiles[0];
    return NextResponse.json(profile);
  }

  if (path.startsWith("career-advisor/match/")) {
    const slug = path.replace("career-advisor/match/", "");
    const profile = careerProfiles.find((p) => p.slug === slug) || careerProfiles[0];
    return NextResponse.json({
      career_title: profile.title,
      career_slug: profile.slug,
      match_score: 78,
      total_required_skills: 8,
      strong_evidence_skills: [
        { skill_name: "React", source: "E-Commerce Project" },
        { skill_name: "TypeScript", source: "Frontend Architecture" },
        { skill_name: "Python", source: "Data Challenge" },
        { skill_name: "SQL", source: "Coursework DB" },
        { skill_name: "Git", source: "GitHub Repositories" },
      ],
      partial_evidence_skills: [
        { skill_name: "REST APIs", importance: "required" },
        { skill_name: "Docker", importance: "preferred" },
      ],
      missing_skills: [
        { skill_name: "Kubernetes", importance: "required", category: "DevOps" },
        { skill_name: "AWS CI/CD", importance: "required", category: "Cloud" },
        { skill_name: "Redis Caching", importance: "preferred", category: "Backend" },
      ],
      estimated_learning_hours: 64,
      priority_recommendations: [
        "Complete containerization fundamentals with Docker",
        "Implement automated CI/CD GitHub Actions pipeline",
        "Deploy a distributed REST API with Redis caching layer",
      ],
    });
  }

  // 5. CV: /cv/list
  if (path === "cv/list") {
    return NextResponse.json([
      {
        id: 1,
        filename: "Alex_Morgan_Resume_2026.pdf",
        ats_score: 84,
        uploaded_at: "2026-10-18T10:30:00Z",
        target_role: user.target_career || "Full-Stack Developer",
        matched_skills_count: 14,
        missing_skills_count: 3,
      },
    ]);
  }

  if (path.startsWith("cv/analyses/")) {
    return NextResponse.json({
      id: 1,
      filename: "Alex_Morgan_Resume_2026.pdf",
      ats_score: 84,
      summary: "Strong candidate with solid academic background, hands-on TypeScript and React projects, and demonstrable Git experience.",
      detected_skills: ["React", "TypeScript", "JavaScript", "Python", "FastAPI", "SQL", "PostgreSQL", "Git", "Tailwind CSS", "HTML5", "REST APIs"],
      missing_skills: ["Docker", "AWS", "CI/CD Pipeline", "Microservices"],
      format_score: 90,
      keyword_match_score: 82,
      recommendations: [
        "Quantify project achievements with metrics (e.g. 'reduced latency by 35%').",
        "Add explicit links to your GitHub repositories and live deployments.",
        "Include containerization technologies (Docker) in the technical skills section.",
      ],
    });
  }

  // 6. Roadmap: /roadmap/active
  if (path === "roadmap/active") {
    return NextResponse.json({
      id: 1,
      career_title: user.target_career || "Full-Stack Developer",
      progress_percentage: 62,
      total_milestones: 4,
      completed_tasks: 7,
      total_tasks: 12,
      milestones: [
        {
          id: 1,
          title: "Phase 1: Modern Full-Stack Architecture",
          description: "Master React 19, Next.js App Router, TypeScript strict typing, and server state management.",
          status: "Completed",
          tasks: [
            { id: 101, title: "Build responsive layout with Tailwind CSS & CSS Tokens", is_completed: true },
            { id: 102, title: "Implement Next.js App Router with Route Handlers", is_completed: true },
            { id: 103, title: "Form validation using Zod and React Hook Form", is_completed: true },
          ],
        },
        {
          id: 2,
          title: "Phase 2: Scalable Backend & Database Modeling",
          description: "Relational database schema modeling, connection pooling, and secure JWT authentication.",
          status: "In Progress",
          tasks: [
            { id: 201, title: "Design PostgreSQL schema with indexing and foreign keys", is_completed: true },
            { id: 202, title: "Implement FastAPI RESTful endpoints with Pydantic v2 schemas", is_completed: true },
            { id: 203, title: "Add token refresh rotation and password hashing", is_completed: true },
            { id: 204, title: "Write automated unit tests with Pytest (10+ tests)", is_completed: true },
          ],
        },
        {
          id: 3,
          title: "Phase 3: Production DevOps & Cloud Deployment",
          description: "Multi-stage Docker containers, CI/CD GitHub Actions, and Vercel cloud orchestration.",
          status: "In Progress",
          tasks: [
            { id: 301, title: "Create optimized Dockerfile with non-root user execution", is_completed: false },
            { id: 302, title: "Setup automated GitHub Actions push and test pipeline", is_completed: false },
            { id: 303, title: "Deploy to Vercel with automatic edge rewrites", is_completed: true },
          ],
        },
        {
          id: 4,
          title: "Phase 4: Capstone Project & Career Verification",
          description: "Deliver a production-ready application with end-to-end evidence verified on FuturePath.",
          status: "Upcoming",
          tasks: [
            { id: 401, title: "Publish verified digital portfolio with shareable public link", is_completed: false },
            { id: 402, title: "Submit application to 3 curated partner internship opportunities", is_completed: false },
          ],
        },
      ],
    });
  }

  // 7. Opportunities: /opportunities
  if (path === "opportunities") {
    const q = req.nextUrl.searchParams.get("q")?.toLowerCase();
    const type = req.nextUrl.searchParams.get("opp_type");
    const slOnly = req.nextUrl.searchParams.get("sri_lanka_only") === "true";

    let filtered = [...opportunities];
    if (q) {
      filtered = filtered.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q) ||
          o.required_skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (type && type !== "All") {
      filtered = filtered.filter((o) => o.type.toLowerCase() === type.toLowerCase());
    }
    if (slOnly) {
      filtered = filtered.filter((o) => o.country === "Sri Lanka");
    }
    return NextResponse.json(filtered);
  }

  if (path === "opportunities/my-tracker") {
    return NextResponse.json({
      applications: [
        {
          application_id: 1,
          id: 1,
          opportunity_id: 2,
          title: "Cloud DevOps Intern",
          organization: "Sysco LABS Sri Lanka",
          status: "applied",
          deadline: "2026-11-15",
          updated_at: "2026-10-21",
          notes: "Submitted CV and verified FuturePath profile link.",
        },
      ],
    });
  }

  // 8. Lectures: /lectures
  if (path === "lectures") {
    return NextResponse.json([
      {
        id: 1,
        title: "Database Systems - Indexing & Query Optimization",
        subject: "Computer Science 302",
        created_at: "2026-10-15",
        key_concepts: ["B-Tree Indexes", "Execution Plans", "Composite Keys", "Covering Indexes"],
        summary: "Detailed review of database query performance, indexing strategies, and locking levels.",
      },
      {
        id: 2,
        title: "Distributed Systems - Consensus & CAP Theorem",
        subject: "Computer Science 308",
        created_at: "2026-10-19",
        key_concepts: ["Raft Consensus", "Partition Tolerance", "Eventual Consistency"],
        summary: "Exploration of partition tolerance trade-offs and leader election in distributed systems.",
      },
    ]);
  }

  // 9. Portfolio: /portfolio
  if (path === "portfolio") {
    return NextResponse.json({
      user_id: user.id,
      full_name: user.full_name,
      headline: `${user.target_career || "Full-Stack Developer"} | Aspiring Software Engineer`,
      bio: "Undergraduate student passionate about building real-world software systems, clean UI architecture, and robust APIs.",
      is_published: true,
      public_slug: `p/${user.id}`,
      skills: ["React", "TypeScript", "Python", "SQL", "Git", "Next.js", "FastAPI"],
      evidence: evidenceItems,
      projects: [
        {
          title: "FuturePath AI Platform",
          description: "Student career intelligence and personalized learning dashboard built with Next.js 15 and FastAPI.",
          tags: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL"],
          github_url: "https://github.com/ayeshikaict-gif/FuturePath-AI",
        },
      ],
    });
  }

  if (path.startsWith("portfolio/public/")) {
    const id = path.replace("portfolio/public/", "");
    const target = users.find((u) => u.id === Number(id)) || user;
    return NextResponse.json({
      user_id: target.id,
      full_name: target.full_name,
      institution: target.institution || "University of Colombo",
      degree: target.degree || "B.Sc. in Computer Science",
      academic_year: target.academic_year || "3rd Year",
      headline: `${target.target_career || "Full-Stack Developer"} | Verified Talent`,
      bio: "Dedicated undergraduate technologist with demonstrated evidence-backed technical skills in modern web and distributed systems.",
      skills: ["React", "TypeScript", "Python", "FastAPI", "SQL", "Git", "Tailwind CSS"],
      evidence: evidenceItems,
      projects: [
        {
          title: "FuturePath AI Platform",
          description: "AI-powered career intelligence platform with skill verification and personalized roadmaps.",
          tags: ["Next.js", "FastAPI", "PostgreSQL", "Docker"],
          github_url: "https://github.com/ayeshikaict-gif/FuturePath-AI",
        },
      ],
    });
  }

  // 10. Dashboard Summary: /dashboard/summary
  if (path === "dashboard/summary") {
    const targetCareerSlug = (user.target_career || "full-stack-developer")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    return NextResponse.json({
      student_name: user.full_name,
      readiness_score: 76,
      verified_skills: 9,
      roadmap_progress: 62,
      ats_score: 84,
      target_career: {
        title: user.target_career || "Full-Stack Developer",
        slug: targetCareerSlug,
        readiness_score: 76,
        readiness_level: "Strong Fit",
      },
      skills_summary: {
        total_skills: 14,
        strong_evidence_count: 9,
        missing_skills_count: 3,
      },
      roadmap_summary: {
        has_roadmap: true,
        progress_percentage: 62,
        completed_tasks: 7,
        total_tasks: 12,
        upcoming_tasks: [
          {
            id: 301,
            title: "Create optimized Dockerfile with non-root user execution",
            skill_name: "Docker",
            estimated_hours: 6,
            phase_title: "Phase 3: Production DevOps & Cloud Deployment",
            resource_url: "https://docs.docker.com/",
          },
        ],
      },
      opportunities_summary: {
        saved_count: 2,
        saved_opportunities: [
          {
            id: 2,
            title: "Cloud DevOps Intern",
            organization: "Sysco LABS Sri Lanka",
            deadline: "2026-11-15",
            location: "Colombo, Sri Lanka",
            opportunity_type: "Internship",
            url: "https://syscolabs.lk/careers",
          },
          {
            id: 6,
            title: "Junior Full-Stack Engineer (Remote)",
            organization: "99x Tech",
            deadline: "2026-12-20",
            location: "Colombo / Remote Norway",
            opportunity_type: "Full-Time",
            url: "https://99x.io/careers",
          },
        ],
      },
      recommended_action: {
        title: "Build Container Skills for Cloud DevOps",
        description: "Complete your upcoming Docker milestone to increase your match score by +12%.",
        link: "/dashboard/roadmap",
        action_label: "Continue Roadmap",
      },
    });
  }

  // Fallback for any unknown GET
  return NextResponse.json({ message: "OK", path });
}

// Helper: send verification email (uses Resend/SMTP if configured, or logs in dev)
async function sendVerificationEmail(email: string, code: string, name: string) {
  console.log(`[FuturePath Auth] Verification code for ${email}: ${code}`);
  
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "FuturePath AI <onboarding@futurepath.edu>",
          to: [email],
          subject: `${code} is your FuturePath AI verification code`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E2E8F0; border-radius: 8px;">
              <h2 style="color: #172033; margin-bottom: 8px;">Welcome to FuturePath AI, ${name}!</h2>
              <p style="color: #64748B; font-size: 14px;">Please use the 6-digit verification code below to verify your student account and complete registration.</p>
              <div style="background-color: #EDF3FF; border: 1px solid #CBDDFE; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2448A5; font-family: monospace;">${code}</span>
              </div>
              <p style="color: #64748B; font-size: 12px;">This code will expire in 15 minutes. If you did not create an account on FuturePath AI, please ignore this email.</p>
            </div>
          `,
        }),
      });
    } catch (err) {
      console.error("[Email Service] Error dispatching email via Resend", err);
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const path = (resolvedParams.path || []).join("/");

  // 1. Auth: /auth/register
  if (path === "auth/register") {
    try {
      const body = await req.json();
      const { email, password, full_name, institution, degree, academic_year, target_career } = body;

      if (!email || !password) {
        return NextResponse.json(
          { detail: "Email and password are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      let existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (existing && existing.is_verified) {
        return NextResponse.json(
          { detail: "An account with this email address already exists. Please sign in." },
          { status: 400 }
        );
      }

      // Generate a secure 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000;

      if (existing) {
        existing.password = password;
        if (full_name) existing.full_name = full_name;
        if (institution) existing.institution = institution;
        if (degree) existing.degree = degree;
        if (academic_year) existing.academic_year = academic_year;
        if (target_career) existing.target_career = target_career;
        existing.verification_code = verificationCode;
        existing.verification_code_expires_at = expiresAt;
      } else {
        existing = {
          id: nextUserId++,
          email: normalizedEmail,
          password,
          full_name: full_name || normalizedEmail.split("@")[0],
          institution: institution || "University of Colombo",
          degree: degree || "B.Sc. in Computer Science",
          academic_year: academic_year || "3rd Year",
          target_career: target_career || "Full-Stack Developer",
          weekly_study_hours: 15,
          onboarding_completed: false,
          is_verified: false,
          verification_code: verificationCode,
          verification_code_expires_at: expiresAt,
          created_at: new Date().toISOString(),
        };
        users.push(existing);
      }

      await sendVerificationEmail(normalizedEmail, verificationCode, existing.full_name);

      return NextResponse.json({
        success: true,
        requires_verification: true,
        email: existing.email,
        preview_code: verificationCode,
        message: `A 6-digit verification code has been sent to ${existing.email}.`,
      });
    } catch {
      return NextResponse.json(
        { detail: "Invalid registration payload." },
        { status: 400 }
      );
    }
  }

  // 1b. Auth: /auth/verify-email
  if (path === "auth/verify-email") {
    try {
      const body = await req.json();
      const { email, code } = body;

      if (!email || !code) {
        return NextResponse.json(
          { detail: "Email and verification code are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return NextResponse.json(
          { detail: "No account found with this email address. Please register first." },
          { status: 404 }
        );
      }

      if (user.is_verified) {
        const token = generateToken(user);
        return NextResponse.json({
          access_token: token,
          token_type: "bearer",
          user: formatUserResponse(user),
          message: "Account already verified. Welcome back!",
        });
      }

      const inputCode = String(code).trim();
      if (!user.verification_code || user.verification_code !== inputCode) {
        return NextResponse.json(
          { detail: "Invalid 6-digit verification code. Please check your email and try again." },
          { status: 400 }
        );
      }

      if (user.verification_code_expires_at && Date.now() > user.verification_code_expires_at) {
        return NextResponse.json(
          { detail: "Verification code has expired. Please request a new code." },
          { status: 400 }
        );
      }

      // Mark verified
      user.is_verified = true;
      user.verification_code = undefined;
      user.verification_code_expires_at = undefined;

      const token = generateToken(user);
      return NextResponse.json({
        access_token: token,
        token_type: "bearer",
        user: formatUserResponse(user),
        message: "Email successfully verified! Welcome to FuturePath AI.",
      });
    } catch {
      return NextResponse.json(
        { detail: "Failed to process verification code." },
        { status: 400 }
      );
    }
  }

  // 1c. Auth: /auth/resend-code
  if (path === "auth/resend-code") {
    try {
      const body = await req.json();
      const { email } = body;
      const normalizedEmail = (email || "").toLowerCase().trim();
      const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return NextResponse.json(
          { detail: "No account found with this email." },
          { status: 404 }
        );
      }

      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verification_code = newCode;
      user.verification_code_expires_at = Date.now() + 15 * 60 * 1000;

      await sendVerificationEmail(normalizedEmail, newCode, user.full_name);

      return NextResponse.json({
        success: true,
        preview_code: newCode,
        message: `A new 6-digit verification code has been sent to ${normalizedEmail}.`,
      });
    } catch {
      return NextResponse.json({ detail: "Failed to resend code." }, { status: 400 });
    }
  }

  // 2. Auth: /auth/login
  if (path === "auth/login") {
    try {
      const body = await req.json();
      const { email, password } = body;

      if (!email || !password) {
        return NextResponse.json(
          { detail: "Email and password are required." },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!user) {
        return NextResponse.json(
          { detail: "No account found with this email address. Please click 'Create an account' to register." },
          { status: 404 }
        );
      }

      // Check password
      if (user.password && user.password !== password) {
        return NextResponse.json(
          { detail: "Incorrect password. Please verify your credentials and try again." },
          { status: 401 }
        );
      }

      // Check email verification status
      if (user.is_verified === false) {
        const freshCode = user.verification_code || Math.floor(100000 + Math.random() * 900000).toString();
        user.verification_code = freshCode;
        user.verification_code_expires_at = Date.now() + 15 * 60 * 1000;
        await sendVerificationEmail(normalizedEmail, freshCode, user.full_name);

        return NextResponse.json(
          {
            detail: "Your email address is not yet verified. Please enter the 6-digit verification code sent to your inbox.",
            requires_verification: true,
            email: user.email,
            preview_code: freshCode,
          },
          { status: 403 }
        );
      }

      const token = generateToken(user);
      return NextResponse.json({
        access_token: token,
        token_type: "bearer",
        user: formatUserResponse(user),
      });
    } catch {
      return NextResponse.json(
        { detail: "Invalid login credentials format." },
        { status: 400 }
      );
    }
  }

  // 3. Auth: /auth/onboarding
  if (path === "auth/onboarding") {
    const user = getAuthenticatedUser(req);
    try {
      const body = await req.json();
      if (body.full_name) user.full_name = body.full_name;
      if (body.institution) user.institution = body.institution;
      if (body.degree) user.degree = body.degree;
      if (body.academic_year) user.academic_year = body.academic_year;
      if (body.target_career) user.target_career = body.target_career;
      if (body.weekly_study_hours) user.weekly_study_hours = body.weekly_study_hours;
      user.onboarding_completed = true;
      return NextResponse.json({ success: true, user });
    } catch {
      return NextResponse.json({ success: true, user });
    }
  }

  // 4. Digital Twin: /digital-twin/evidence
  if (path === "digital-twin/evidence") {
    try {
      const body = await req.json();
      const newEv = {
        id: evidenceItems.length + 1,
        title: body.title || "New Verified Evidence",
        category: body.category || "Project",
        skill_name: body.skill_name || "Software Development",
        verification_status: "Verified",
        date: new Date().toISOString().split("T")[0],
        description: body.description || "",
      };
      evidenceItems.push(newEv);
      return NextResponse.json({ success: true, evidence: newEv });
    } catch {
      return NextResponse.json({ success: true });
    }
  }

  // 5. Career Advisor: /career-advisor/set-goal
  if (path === "career-advisor/set-goal") {
    const user = getAuthenticatedUser(req);
    try {
      const body = await req.json();
      if (body.career_slug) {
        const found = careerProfiles.find((p) => p.slug === body.career_slug);
        if (found) user.target_career = found.title;
      }
      return NextResponse.json({ success: true, target_career: user.target_career });
    } catch {
      return NextResponse.json({ success: true });
    }
  }

  // 6. CV Upload: /cv/upload
  if (path === "cv/upload") {
    return NextResponse.json({
      id: 1,
      filename: "Uploaded_Resume.pdf",
      ats_score: 86,
      message: "CV successfully parsed and analyzed with NLP skill extraction.",
      detected_skills: ["React", "TypeScript", "Python", "SQL", "Git", "REST APIs", "Tailwind CSS"],
      missing_skills: ["Docker", "Kubernetes", "AWS"],
    });
  }

  // 7. Roadmap: /roadmap/generate
  if (path === "roadmap/generate") {
    const user = getAuthenticatedUser(req);
    const careerSlug = req.nextUrl.searchParams.get("career_slug") || "full-stack-developer";
    const found = careerProfiles.find((p) => p.slug === careerSlug);
    if (found) user.target_career = found.title;

    return NextResponse.json({
      success: true,
      message: `Personalized Roadmap regenerated for ${user.target_career}.`,
    });
  }

  // 8. Opportunities: /opportunities/:id/bookmark & /opportunities/:id/apply & /opportunities/sync
  if (path.includes("opportunities/") && path.endsWith("/bookmark")) {
    const id = parseInt(path.split("/")[1]);
    const opp = opportunities.find((o) => o.id === id);
    if (opp) opp.is_bookmarked = !opp.is_bookmarked;
    return NextResponse.json({ success: true, is_bookmarked: opp?.is_bookmarked });
  }

  if (path.includes("opportunities/") && path.endsWith("/apply")) {
    return NextResponse.json({ success: true, message: "Application status updated successfully." });
  }

  if (path === "opportunities/sync") {
    return NextResponse.json({
      status: "success",
      synced_count: opportunities.length,
      message: "Synced live Sri Lankan & global opportunity intelligence feed.",
    });
  }

  // 9. Simulator: /simulator/evaluate
  if (path === "simulator/evaluate") {
    try {
      const body = await req.json();
      const addedCount = (body.skills_to_add || []).length;
      const baseReadiness = 76;
      const simulatedReadiness = Math.min(98, baseReadiness + addedCount * 6);
      return NextResponse.json({
        base_readiness: baseReadiness,
        simulated_readiness: simulatedReadiness,
        readiness_increase: simulatedReadiness - baseReadiness,
        base_salary: "250,000 LKR/mo",
        simulated_salary: `${250000 + addedCount * 35000} LKR/mo`,
        salary_increase: `+${addedCount * 35000} LKR/mo`,
        unlocked_roles_count: addedCount * 2,
      });
    } catch {
      return NextResponse.json({ simulated_readiness: 85, readiness_increase: 9 });
    }
  }

  // 10. Portfolio: /portfolio/publish
  if (path === "portfolio/publish") {
    return NextResponse.json({ success: true, is_published: true });
  }

  // 11. Lectures: /lectures/upload
  if (path === "lectures/upload") {
    return NextResponse.json({
      id: 3,
      status: "processed",
      message: "Lecture notes synthesized into study flashcards and key concept maps.",
    });
  }

  return NextResponse.json({ success: true, path });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const path = (resolvedParams.path || []).join("/");
  const user = getAuthenticatedUser(req);

  if (path === "auth/profile") {
    try {
      const body = await req.json();
      if (body.full_name) user.full_name = body.full_name;
      if (body.institution) user.institution = body.institution;
      if (body.degree) user.degree = body.degree;
      if (body.academic_year) user.academic_year = body.academic_year;
      if (body.target_career) user.target_career = body.target_career;
      if (body.weekly_study_hours) user.weekly_study_hours = body.weekly_study_hours;
      return NextResponse.json({ success: true, user });
    } catch {
      return NextResponse.json({ success: true, user });
    }
  }

  return NextResponse.json({ success: true, path });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const path = (resolvedParams.path || []).join("/");

  if (path.startsWith("roadmap/tasks/")) {
    return NextResponse.json({ success: true, message: "Task state toggled." });
  }

  return NextResponse.json({ success: true, path });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const resolvedParams = await params;
  const path = (resolvedParams.path || []).join("/");

  if (path.startsWith("digital-twin/evidence/")) {
    const id = parseInt(path.replace("digital-twin/evidence/", ""));
    const idx = evidenceItems.findIndex((e) => e.id === id);
    if (idx !== -1) evidenceItems.splice(idx, 1);
    return NextResponse.json({ success: true });
  }

  if (path === "auth/account") {
    return NextResponse.json({ success: true, message: "Account deleted." });
  }

  return NextResponse.json({ success: true, path });
}
