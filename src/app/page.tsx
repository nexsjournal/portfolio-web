import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FooterSection } from "@/components/sections/footer-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { ProductsSection } from "@/components/sections/products-section";

export default function Home() {
  return (
    <main className="bg-[#06080e] text-white">
      <HeroSection />
      <ProductsSection />
      <AboutSection />
      <PhilosophySection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
