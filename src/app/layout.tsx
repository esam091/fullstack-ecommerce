import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Happy Commerce",
  description: "eCommerce Portfolio",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(75 75% 17%)",
        },
      }}
    >
      <html lang="en">
        <body className={`font-sans ${inter.variable} h-full`}>
          <TRPCReactProvider cookies={cookies().toString()}>
            <NavBar />
            <main className="pt-6">{children}</main>
          </TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
