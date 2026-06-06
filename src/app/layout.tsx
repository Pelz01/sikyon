import type { Metadata } from "next";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SuiProviders from "@/components/SuiProviders";

const instrumentSans = Instrument_Sans({ 
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Sikyon | Verifiable Attestations",
  description: "Verifiable treasury attestations on Sui and Walrus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${instrumentSans.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-zinc-200 selection:text-black bg-zinc-50`}>
        <SuiProviders>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </SuiProviders>
      </body>
    </html>
  );
}
