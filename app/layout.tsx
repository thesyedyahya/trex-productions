import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://t-rex-productions.com"),
  title: {
    default: "T-Rex Productions — Creative Production Studio, Dubai",
    template: "%s — T-Rex Productions",
  },
  description:
    "Dubai-based creative production studio. 3D animation & CGI, games & interactive apps, immersive experiences, and full branding. We make brands roar.",
  keywords: [
    "3D animation Dubai",
    "CGI studio UAE",
    "interactive experiences Dubai",
    "game development UAE",
    "branding agency Dubai",
    "creative production studio",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "T-Rex Productions",
    title: "T-Rex Productions — We Make Brands Roar",
    description:
      "3D animation, CGI, games, immersive tech and branding — engineered in Dubai.",
  },
  twitter: {
    card: "summary_large_image",
    title: "T-Rex Productions — We Make Brands Roar",
    description:
      "3D animation, CGI, games, immersive tech and branding — engineered in Dubai.",
  },
};

export const viewport: Viewport = {
  themeColor: "#02060f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
