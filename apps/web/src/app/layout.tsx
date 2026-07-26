import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Grayscale OS v1.0 — Organizational Operating System",
  description:
    "Grayscale OS is the Organizational Operating System for founders, boards, and enterprises. Decision quality, institutional memory, executive explainability, and constitutional governance. Codename: Bedrock.",
  keywords: [
    "organizational operating system",
    "enterprise intelligence",
    "founder governance",
    "mission control",
    "digital twin",
    "executive council",
    "institutional memory",
    "decision quality",
  ],
  openGraph: {
    title: "Grayscale OS v1.0 — Organizational Operating System",
    description:
      "Infrastructure for collective judgment. Not a chatbot — an Organizational Operating System built on constitutional governance.",
    type: "website",
    url: "https://www.projectgrayscale.com",
  },
  icons: {
    icon: "/grayscale-logo.png",
    apple: "/grayscale-logo.png",
  },
  metadataBase: new URL("https://www.projectgrayscale.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
