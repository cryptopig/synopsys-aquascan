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
      <body className={inter.className} style={{backgroundColor: "#f3f3f3"}}>
        {/* <Theme>{children}</Theme> */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center", backgroundColor: "#fff", zIndex: 9999, position: "relative" }}>
          <Navbar></Navbar>
        </div>
        {children}
      </body>
      <Toaster />
    </html>
  );
}