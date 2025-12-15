// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 브라우저 탭 타이틀
  title: {
    default: "AENEAS Studio · Brand & Web Direction",
    template: "%s · AENEAS Studio",
  },
  // 기본 설명
  description:
    "사막 같은 시장에서 다음 그린 플레이스로 걸어가는 브랜드를 위한 Brand & Web Direction 스튜디오.",

  metadataBase: new URL("https://aeneas-portfolio.vercel.app"),

  openGraph: {
    type: "website",
    url: "/",
    siteName: "AENEAS Studio",
    title:
      "AENEAS Studio · Brands that walk through the desert into their next green place.",
    description:
      "명확한 이야기, 선명한 UX, 현실적인 런칭 플랜이 필요한 브랜드를 위한 Brand & Web Direction 스튜디오.",
    images: [
      {
        url: "/og-aeneas-studio.png", // public/og-aeneas-studio.png 로 추가하면 됨
        width: 1200,
        height: 630,
        alt: "AENEAS Studio hero interface and constellation panel.",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AENEAS Studio · Brand & Web Direction",
    description:
      "Brand Core, Web Experience, Visual Systems까지 함께 설계하는 AENEAS Studio.",
    images: ["/og-aeneas-studio.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
