import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

//https://zenn.dev/nino/books/30e21d37af73b5/viewer/init-cloudflare

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignInUrl="/" afterSignUpUrl="/onboarding">
      <html lang="ja">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}