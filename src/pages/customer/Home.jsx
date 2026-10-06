import Hero from "../../components/customer/Hero";
import MarqueeTicker from "../../components/customer/MarqueeTicker";
import BestSellers from "../../components/customer/BestSellers";
import CategoriesSection from "../../components/customer/CategoriesSection";
import EditorialStoryBanner from "../../components/customer/EditorialStoryBanner";
import RecentlyViewed from "../../components/home/RecentlyViewed";

export default function Home() {
  return (
    <main className="bg-white text-neutral-900 selection:bg-black selection:text-white">
      {/* 1. Dual-Split Editorial Hero */}
      <Hero />

      {/* 2. Black Marquee Running Ticker (matching mockup) */}
      <MarqueeTicker />

      {/* 3. Bestsellers Grid with Wine Editorial Title */}
      <BestSellers />

      {/* 4. Categories Showcase with 3 Portrait Cards */}
      <CategoriesSection />

      {/* 5. Editorial Philosophy Story Banner */}
      <EditorialStoryBanner />

      {/* 6. Recently Viewed Products */}
      <RecentlyViewed />
    </main>
  );
}