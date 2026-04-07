import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "BuildSpace - Developer Collaboration Platform",
  description:
    "Connect with developers, collaborate on projects, and discover opportunities. BuildSpace brings together developer profiles, project collaboration, and opportunity discovery.",
  openGraph: {
    title: "BuildSpace - Developer Collaboration Platform",
    description:
      "Connect with developers, collaborate on projects, and discover opportunities.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
