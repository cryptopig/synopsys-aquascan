import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/app/ui/sonner";
// import '@radix-ui/themes/styles.css';
// import { Theme } from '@radix-ui/themes';
import Navbar from './components/navbar';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AquaScan",
  description: "AquaScan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <Theme>{children}</Theme> */}
        <Navbar></Navbar>
        {children}
      </body>
      <Toaster />
    </html>
  );
}