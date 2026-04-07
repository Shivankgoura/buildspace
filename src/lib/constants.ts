export const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
  "Ruby", "PHP", "Swift", "Kotlin", "Dart", "R", "Scala",
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Solid.js",
  "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring Boot",
  "Rails", "Laravel", "ASP.NET",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Supabase",
  "AWS", "GCP", "Azure", "Docker", "Kubernetes",
  "TailwindCSS", "SCSS", "Figma", "UI/UX Design",
  "React Native", "Flutter", "iOS", "Android",
  "Machine Learning", "Data Science", "AI/ML", "NLP",
  "GraphQL", "REST API", "WebSockets",
  "Git", "CI/CD", "DevOps", "Linux",
  "Blockchain", "Web3", "Solidity",
] as const;

export const INTERESTS_OPTIONS = [
  "Web Development", "Mobile Development", "Game Development",
  "AI/ML", "Data Science", "Cybersecurity", "Cloud Computing",
  "DevOps", "Blockchain", "IoT", "AR/VR",
  "Open Source", "Hackathons", "Competitive Programming",
  "System Design", "UI/UX Design", "Technical Writing",
  "Startups", "Freelancing", "Research",
] as const;

export const PROJECT_STATUS = {
  open: { label: "Open", color: "bg-[#34d39918] text-[#047857] dark:bg-[#34d39915] dark:text-[#34d399]" },
  "in-progress": { label: "In Progress", color: "bg-[#fbbf2418] text-[#92400e] dark:bg-[#fbbf2415] dark:text-[#fbbf24]" },
  completed: { label: "Completed", color: "bg-[#449afb18] text-[#003087] dark:bg-[#449afb15] dark:text-[#449afb]" },
} as const;

export const OPPORTUNITY_TYPES = {
  teammate: { label: "Looking for Teammates", color: "bg-[#34d39918] text-[#047857] dark:bg-[#34d39915] dark:text-[#34d399]", icon: "Users" },
  hiring: { label: "Hiring for Project", color: "bg-[#449afb18] text-[#003087] dark:bg-[#449afb15] dark:text-[#449afb]", icon: "Briefcase" },
  hackathon: { label: "Hackathon Team", color: "bg-[#003087]/10 text-[#003087] dark:bg-[#449afb15] dark:text-[#449afb]", icon: "Trophy" },
} as const;
