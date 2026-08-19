import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AOSProvider from "@/components/providers/AOSProvider";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raditya Rai Zeeshan | Fullstack Web Developer",
  description: "Portofolio resmi Raditya Rai Zeeshan. Seorang Fullstack Web Developer yang berfokus pada pembuatan website modern, responsif, dan interaktif.",
  keywords: ["Raditya Rai Zeeshan", "Portofolio Raditya", "Web Developer", "Fullstack Developer", "Frontend Next.js", "Z - Project"],
  authors: [{ name: "Raditya Rai Zeeshan" }],
  openGraph: {
    title: "Raditya Rai Zeeshan | Portfolio",
    description: "Portofolio resmi Raditya Rai Zeeshan. Fullstack Web Developer.",
    url: "https://radityarz.my.id",
    siteName: "Raditya Rai Zeeshan Portfolio",
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
    <html lang="id" className={`${poppins.variable} ${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-inter bg-surface text-textMain overflow-x-hidden">
        <AuthSessionProvider>
          <AOSProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AOSProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
