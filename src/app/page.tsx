import Link from "next/link";
import { Users, FolderKanban, Megaphone, ArrowRight } from "lucide-react";
import { LogoBrand, LogoIcon } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <LogoBrand size="md" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Where Developers{" "}
              <span className="bg-gradient-to-r from-[#001c64] to-[#003087] dark:from-[#449afb] dark:to-[#0070e0] bg-clip-text text-transparent">
                Connect & Build
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              BuildSpace brings together developer profiles, project collaboration,
              and opportunity discovery into one unified platform. Find teammates,
              join projects, and grow together.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2 text-base px-8">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute inset-x-0 top-0 -z-10 h-[500px] [background:linear-gradient(180deg,#001435_0%,transparent_100%)] opacity-[0.03] dark:opacity-[0.15]" />
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to collaborate
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Developer Profiles",
                description:
                  "Showcase your skills, interests, and projects. Connect with developers who share your passion.",
              },
              {
                icon: FolderKanban,
                title: "Project Collaboration",
                description:
                  "Create projects, form teams, and build together. Find the right teammates for your next big idea.",
              },
              {
                icon: Megaphone,
                title: "Opportunity Board",
                description:
                  "Discover hackathon teams, project roles, and collaboration opportunities. Never miss a chance to grow.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,28,100,0.1)] hover:border-[#0070e0]/30 hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003087]/10 dark:bg-[#449afb]/10 mb-4 group-hover:bg-[#003087]/20 dark:group-hover:bg-[#449afb]/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-[#003087] dark:text-[#449afb]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start building?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join BuildSpace today and connect with a community of passionate developers.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2 text-base px-8">
              Create Your Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <LogoBrand size="sm" />
          <p className="text-sm text-muted-foreground">
            Built for SDC Hack Week 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
