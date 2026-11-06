import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raditya Rai Zeeshan | Fullstack Developer & Founder of Z - Project",
  description:
    "Portofolio resmi Raditya Rai Zeeshan (radityarz). Fullstack Web Developer, UI/UX Designer, dan Founder of Z - Project.",
  authors: [{ name: "Raditya Rai Zeeshan" }],
  keywords: [
    "Raditya Rai Zeeshan",
    "radityarz",
    "Fullstack Developer",
    "Z - Project",
    "Portfolio Next.js",
  ],
};

export const viewport: Viewport = {
  themeColor: "#08090C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="bg-[#08090C] text-[#F1F5F9] font-sans antialiased selection:bg-[#00F59B] selection:text-[#08090C]">
        {children}
      </body>
    </html>
  );
}
