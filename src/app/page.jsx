"use server"
import Image from "next/image";
import { WorldMapComponent } from "@/components/landing-page/world-map";
import { FeaturesSectionDemo } from "@/components/landing-page/features-section";
import Hero from "@/components/landing-page/hero-section";
export default async function Home() {
  return (
    <div className="h-full w-full">
        <Hero />
        {/* <div className="container mx-auto">
          <FeaturesSectionDemo />
        </div> */}
        {/* <WorldMapComponent /> */}
    </div>
  );
}
