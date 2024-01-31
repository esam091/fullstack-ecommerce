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
  title: "Kaimono",
  description: "Fullstack Portfolio",
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
        <body
          className={`font-sans ${inter.variable} flex h-full flex-col items-center`}
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            <NavBar />
            <main className="container p-10 pb-16">{children}</main>
          </TRPCReactProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
