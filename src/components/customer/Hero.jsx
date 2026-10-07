import { Link } from "react-router-dom";
import heroImage from "../../assets/images/heroimage.png";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen bg-black text-white overflow-hidden flex flex-col justify-end">
      {/* Single Hero Image Background */}
      <div className="absolute inset-0 overflow-hidden bg-neutral-950">
        <img
          src={heroImage}
          alt="YUMI Hero"
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />
      </div>

      {/* Center Overlaid Editorial Typography & CTA */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pb-20 sm:pb-24 pt-32">
        {/* Script Signature Wordmark (matching "Chienne" in mockup) */}
        <h1 className="font-script text-7xl sm:text-8xl md:text-9xl text-white tracking-normal drop-shadow-2xl leading-[0.9] select-none">
          Yumi
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-sm md:text-base text-neutral-200 tracking-[0.25em] uppercase font-light max-w-2xl mx-auto drop-shadow-md">
          Clothing that emphasizes elegance and remains timeless
        </p>

        {/* Action Button (white pill matching mockup "Перейти в каталог") */}
        <div className="mt-8 sm:mt-10 flex items-center justify-center">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-block bg-white text-black px-10 py-3.5 text-xs font-medium uppercase tracking-[0.25em] hover:bg-neutral-900 hover:text-white transition duration-300 shadow-2xl"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </section>
  );
}