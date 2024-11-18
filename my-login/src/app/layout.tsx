import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { NotificationProvider } from "./context/notificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Nextjs 13",
  description: "Login con nextjs13",
};

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          <main className="min-h-screen flex flex-col items-center justify-center">
            {children}
          </main>
        </NotificationProvider>
      </body>
    </html>
  );
}
