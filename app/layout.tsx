import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Nav from "@/components/nav";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased flex min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <Nav />
            <div className="flex-1 min-h-screen w-full overflow-hidden">
              {children}
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
