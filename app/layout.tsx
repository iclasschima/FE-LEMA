// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font
import "./globals.css"; // Your global Tailwind CSS
import Providers from "./providers"; // Your React Query Providers

// Define the Inter font instance
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Management App",
  description: "A web application for managing users and their posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the Inter font's className to the body tag */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
