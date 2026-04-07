"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, User, Code2, Heart } from "lucide-react";
import { LogoIcon } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { SKILLS_OPTIONS, INTERESTS_OPTIONS } from "@/lib/constants";

const steps = [
  { title: "Basic Info", icon: User, description: "Tell us about yourself" },
  { title: "Skills", icon: Code2, description: "What technologies do you know?" },
  { title: "Interests", icon: Heart, description: "What are you passionate about?" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !username.trim()) {
      setError("Name and username are required");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Check username uniqueness (exclude own profile for retry attempts)
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase().trim())
      .neq("user_id", user.id)
      .single();

    if (existing) {
      setError("Username is already taken");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      full_name: fullName.trim(),
      username: username.toLowerCase().trim(),
      bio: bio.trim(),
      skills,
      interests,
      github_url: githubUrl.trim(),
      linkedin_url: linkedinUrl.trim(),
      portfolio_url: portfolioUrl.trim(),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <LogoIcon size="md" />
          <h1 className="text-xl font-bold text-[#001c64] dark:text-white">Set up your profile</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  i <= step
                    ? "bg-[#003087] dark:bg-[#449afb] text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 w-8 transition-colors ${
                    i < step ? "bg-[#003087] dark:bg-[#449afb]" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const StepIcon = steps[step].icon;
                return <StepIcon className="h-5 w-5 text-primary" />;
              })()}
              {steps[step].title}
            </CardTitle>
            <CardDescription>{steps[step].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-[#c0392b] bg-[#c0392b10] dark:bg-[#c0392b]/15 rounded-lg border-l-[3px] border-[#c0392b]">
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1e3251] dark:text-[#e2e8f0]">Full Name *</label>
                  <Input
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1e3251] dark:text-[#e2e8f0]">Username *</label>
                  <Input
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                    }
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Your profile URL: buildspace.dev/profile/{username || "username"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#1e3251] dark:text-[#e2e8f0]">Bio</label>
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">GitHub URL</label>
                    <Input
                      placeholder="github.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">LinkedIn URL</label>
                    <Input
                      placeholder="linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Portfolio URL</label>
                    <Input
                      placeholder="yoursite.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select the technologies you&apos;re familiar with ({skills.length} selected)
                </p>
                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                  {SKILLS_OPTIONS.map((skill) => (
                    <Badge
                      key={skill}
                      variant={skills.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer transition-colors hover:bg-primary/80"
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Interests */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  What areas are you passionate about? ({interests.length} selected)
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_OPTIONS.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer transition-colors hover:bg-primary/80"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {step < steps.length - 1 ? (
                <Button
                  onClick={() => {
                    if (step === 0 && (!fullName.trim() || !username.trim())) {
                      setError("Name and username are required");
                      return;
                    }
                    setError("");
                    setStep((s) => s + 1);
                  }}
                  className="gap-1"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="gap-1">
                  {loading ? "Creating..." : "Complete Setup"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
