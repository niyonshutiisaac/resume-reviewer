import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Merit — Make your resume earn the read",
    template: "%s · Merit",
  },
  description:
    "Upload your resume, paste a job description, and get a clear, specific review: missing skills, weak bullets, keyword alignment, and ATS checks.",
  applicationName: "Merit",
  keywords: [
    "resume review",
    "AI resume checker",
    "ATS resume",
    "job description match",
    "resume feedback",
  ],
  openGraph: {
    title: "Merit — Make your resume earn the read",
    description:
      "A calmer, more specific resume review. See what's working, what's missing, and what to fix first.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merit — Make your resume earn the read",
    description:
      "A calmer, more specific resume review. See what's working, what's missing, and what to fix first.",
  },
};

export const viewport: Viewport = {
  themeColor: "#341CD7",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans`}>{children}</body>
    </html>
  );
}
