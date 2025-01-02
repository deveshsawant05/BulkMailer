"use server"
import Image from "next/image";
import { WorldMapComponent } from "@/components/landing-page/world-map";
import { FeaturesSectionDemo } from "@/components/landing-page/features-section";
import Hero from "@/components/landing-page/hero-section";
import { HeroScrollDemo } from "@/components/landing-page/container-scroll";
import Footer from "@/components/ui/footer";
export default async function Home() {
  return (
    <div className="h-full w-full">
      <Hero />
      <HeroScrollDemo />
      <div className="flex w-full justify-center items-center">
        <div className=" w-3/4">
          <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.05] relative flex items-center justify-center">
          {/* Radial gradient for the container to give a faded look */}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
              <FeaturesSectionDemo />
            </div>
        </div>
        </div>
      <Footer />
      {/* <WorldMapComponent /> */}
    </div>
  );
}
