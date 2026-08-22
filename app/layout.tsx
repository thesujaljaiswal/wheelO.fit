import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Wheelo.fit - Premium Cycling Experiences",
  description: "Join Wheelo.fit for high-octane cycling classes, midnight rides in Mumbai, scenic Sunday morning rides, and premium cycle rentals.",
  metadataBase: new URL("https://wheelo.fit"),
  openGraph: {
    title: "Wheelo.fit - Premium Cycling Experiences",
    description: "Join Wheelo.fit for high-octane cycling classes, midnight rides in Mumbai, scenic Sunday morning rides, and premium cycle rentals.",
    url: "https://wheelo.fit",
    siteName: "Wheelo.fit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheelo.fit - Premium Cycling Experiences",
    description: "Join Wheelo.fit for high-octane cycling classes, midnight rides in Mumbai, scenic Sunday morning rides, and premium cycle rentals.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  );
}
