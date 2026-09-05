import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { FleetSection } from './components/FleetSection';
import { FreightCalculator } from './components/FreightCalculator';
import { WhyUsSection } from './components/WhyUsSection';
import { SocialAndContactSection } from './components/SocialAndContactSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-[#0B2240]">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* Hero Section with Integrated Quick Quote Form */}
        <HeroSection />

        {/* Services Showcase */}
        <ServicesSection />

        {/* Why Choose Itupeva Log Express */}
        <WhyUsSection />

        {/* Fleet Catalog */}
        <FleetSection />

        {/* Interactive Freight & Cubage Calculator */}
        <FreightCalculator />

        {/* Social Networks & Direct Contact Section */}
        <SocialAndContactSection />
      </main>

      {/* Complete Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button with Quick Chat Widget */}
      <FloatingWhatsApp />
    </div>
  );
}
