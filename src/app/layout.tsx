import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Raditya Rai Zeeshan | Developer & AI Engineer Terminal",
  description:
    "Portofolio interaktif berbasis developer terminal oleh Raditya Rai Zeeshan. Fullstack Web Developer & AI Enthusiast.",
  keywords: [
    "Raditya Rai Zeeshan",
    "Terminal Portfolio",
    "Fullstack Developer",
    "Next.js Developer",
    "AI Engineer",
    "Z - Project",
  ],
  authors: [{ name: "Raditya Rai Zeeshan" }],
  openGraph: {
    title: "Raditya Rai Zeeshan | Developer Terminal Portfolio",
    description: "Interactive CLI portfolio showcasing projects, experience, and system architecture.",
    url: "https://radityarz.my.id",
    siteName: "Raditya Rai Zeeshan Terminal",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${spaceGrotesk.variable} ${spaceMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#0b0f17] text-[#f8fafc] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
