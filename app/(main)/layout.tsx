import React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="mandala-bg"></div>
      <div className="mandala-bg-2"></div>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
