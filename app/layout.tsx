import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import BottomNavbar from "@/components/BottomNavbar";
import StoreProvider from "@/app/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FurniCo",
  description: "Furniture for modern living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <SessionProvider>
            <Navbar />
            <div className="pt-16 pb-[64px] lg:pb-0">
              {children}
            </div>
            <BottomNavbar />
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}