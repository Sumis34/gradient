import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { PersistenceProvider } from "@/context/persistence-context";
import { ReplicationProvider } from "@/context/replication-context";
import { CollectionProvider } from "@/context/collection-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Gradient - Grade Tracker",
  description: "A personal grade tracker for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${instrument.variable} antialiased dark`}
      >
        <AuthProvider>
          <PersistenceProvider>
            <ReplicationProvider>
              <CollectionProvider>{children}</CollectionProvider>
            </ReplicationProvider>
          </PersistenceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
