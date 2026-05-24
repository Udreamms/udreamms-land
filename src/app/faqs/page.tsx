"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import FAQsSection from "@/components/landing/FAQsSection";

export default function FAQsPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/10">
      <Header />
      <main className="pt-14">
        <FAQsSection />
      </main>
      <Footer />
    </div>
  );
}
