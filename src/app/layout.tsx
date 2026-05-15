import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Navbar from "@/components/Navbar";
import { AppStateProvider } from "@/lib/context";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShapeShop",
  description: "Pick a shape, explore in 3D, and discover products tailored to your geometry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <AppStateProvider>
          <Navbar />
          <div className="flex flex-1 flex-col">{children}</div>
        </AppStateProvider>
      </body>
    </html>
  );
}
