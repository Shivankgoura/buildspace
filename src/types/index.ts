export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  interests: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  tech_stack: string[];
  status: "open" | "in-progress" | "completed";
  max_members: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  owner?: Profile;
  members?: ProjectMember[];
  member_count?: number;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  // Joined
  profile?: Profile;
}

export interface Opportunity {
  id: string;
  author_id: string;
  title: string;
  description: string;
  type: "teammate" | "hiring" | "hackathon";
  skills_needed: string[];
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: Profile;
  interest_count?: number;
  is_interested?: boolean;
}

export interface OpportunityInterest {
  id: string;
  opportunity_id: string;
  user_id: string;
  created_at: string;
  profile?: Profile;
}

export interface FeedEvent {
  id: string;
  user_id: string;
  event_type: string;
  reference_id: string;
  reference_type: string;
  metadata: Record<string, string>;
  created_at: string;
  // Joined
  profile?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  type: string;
  read: boolean;
  reference_id: string;
  reference_type: string;
  created_at: string;
}
