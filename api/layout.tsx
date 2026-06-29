import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boris' Goodbye Party",
  description: "RSVP for Boris' Goodbye Party on July 11, 2026 at Pool House.",
  openGraph: {
    title: "Boris' Goodbye Party",
    description: "One last evening together. July 11, 2026 · Pool House.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
