import { profile } from "@/content/profile";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./portfolio.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} | Computer Science Portfolio`,
    template: `%s | ${profile.name}`,
  },
  description: profile.description,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} | Computer Science Portfolio`,
    description: profile.description,
  },
  twitter: {
    card: "summary",
    title: `${profile.name} | Computer Science Portfolio`,
    description: profile.description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#090B0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}