import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GermanyMove Checklist",
  description: "Personalised relocation checklists for newcomers moving to Germany.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
