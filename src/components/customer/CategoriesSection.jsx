import { useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import nightwearImg from "../../assets/images/collections/nightwear.png";
import abayaImg from "../../assets/images/collections/abaya.jpeg";
import kaftanImg from "../../assets/images/collections/kaftan.jpeg";
import coordSetImg from "../../assets/images/collections/coord-set.jpeg";

const CATEGORIES = [
  {
    title: "Abayas",
    subtitle: "Modest Elegance",
    image: abayaImg,
    link: "/abayas",
  },
  {
    title: "Nightwear",
    subtitle: "Pure Silk Comfort",
    image: nightwearImg,
    link: "/nightwear",
  },
  {
    title: "Kaftans",
    subtitle: "Flowing Luxury",
    image: kaftanImg,
    link: "/kaftans",
  },
  {
    title: "Co-ord Sets",
    subtitle: "Effortless Tailoring",
    image: coordSetImg,
    link: "/coord-sets",
  },
];

export default function CategoriesSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : CATEGORIES.length - visibleCount));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + visibleCount < CATEGORIES.length ? prev + 1 : 0));
  };

  const displayed = CATEGORIES.slice(startIndex, startIndex + visibleCount);
  if (displayed.length < visibleCount) {
    displayed.push(...CATEGORIES.slice(0, visibleCount - displayed.length));
  }

  return (
    <section className="py-16 sm:py-24 bg-white text-neutral-900 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Title, Philosophy Copy & View All Button */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full pr-0 lg:pr-6">
            <div>
              <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[#7E222A] tracking-tight">
                Categories
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-neutral-600 max-w-sm">
                Each piece is created to emphasize your individuality. Choose what speaks to your mood and defines your timeless presence.
              </p>
            </div>

            <div className="mt-8 lg:mt-24">
              <Link
                to="/shop"
                className="inline-block px-7 py-2.5 border border-neutral-800 text-xs font-medium uppercase tracking-[0.15em] hover:bg-black hover:text-white transition duration-300"
              >
                View All
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Editorial Category Cards & Carousel Arrows */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {displayed.map((cat, idx) => (
                <Link
                  key={`${cat.title}-${idx}`}
                  to={cat.link}
                  className="group relative aspect-[3/4.5] overflow-hidden bg-neutral-900 block"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05] group-hover:scale-105 group-hover:brightness-[0.85] transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Title Overlaid */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="font-editorial text-2xl sm:text-3xl text-white tracking-wider font-light drop-shadow-md group-hover:scale-110 transition duration-300">
                      {cat.title}
                    </h3>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-300 mt-2 opacity-0 group-hover:opacity-100 transition duration-300">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Slider Navigation Controls (matching bottom-right circle arrows in mockup) */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-black hover:bg-black hover:text-white transition duration-300"
                aria-label="Previous categories"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-black hover:bg-black hover:text-white transition duration-300"
                aria-label="Next categories"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
