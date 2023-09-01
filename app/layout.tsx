import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Memozang",
  description: "Just memo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
