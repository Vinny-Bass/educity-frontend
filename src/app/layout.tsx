import { AuthProvider } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontBaloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-baloo",
});

export const metadata: Metadata = {
  title: "Educity",
  description: "Welcome to Educity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontBaloo.variable
        )}
      >
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
