import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="ko" suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
