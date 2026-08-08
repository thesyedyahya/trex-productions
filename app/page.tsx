import { Hero } from "@/components/ui/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { ContactCTA, Footer, Studio, Work } from "@/components/ui/Sections";
import { Services } from "@/components/ui/ServiceCards";
import { BootLoader, Grain } from "@/components/ui/Effects";
import {
  BrandMark,
  MenuSystem,
  SectionDots,
  SoundToggle,
} from "@/components/ui/Overlay";

export default function Home() {
  return (
    <>
      <BootLoader />
      <Grain />
      <BrandMark />
      <MenuSystem />
      <SectionDots />
      <SoundToggle />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Services />
        <Studio />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
