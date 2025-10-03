import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import Testimonial from "@/components/Testimonial";
import Matches from "@/components/Matches";

export const metadata: Metadata = {
  title: "Tóték - 2025 - Ősz",

  // other metadata
  description: "A Tóték focicsapat hivatalos management oldala"
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Brands />
      <Matches />
      <Feature />
{/*       <About />
      <FeaturesTab />
      <FunFact />
      <Integration />
      <CTA />
      <FAQ />
      <Testimonial />
      <Pricing />
      <Contact />
      <Blog /> */}
    </main>
  );
}
