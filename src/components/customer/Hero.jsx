import { Link } from "react-router-dom";
import { useState } from "react";
import heroVideo from "../../assets/videos/hero.mp4";
import discoverVideo from "../../assets/videos/discover.mp4";
import leftEditorialImage from "../../assets/images/story/story.png";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen bg-black text-white overflow-hidden flex flex-col justify-end">
      {/* Dual Split Editorial Visual Panels */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel: High Fashion Editorial Portrait */}
        <div className="relative h-full w-full overflow-hidden bg-neutral-900 border-r border-white/10 hidden md:block">
          <img
            src={leftEditorialImage}
            alt="YUMI High Fashion Editorial"
            className="w-full h-full object-cover object-top filter brightness-[0.75] contrast-[1.1] hover:scale-105 transition duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>

        {/* Right Panel: Looping Cinematic Video */}
        <div className="relative h-full w-full overflow-hidden bg-neutral-950">
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center filter brightness-[0.8] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />
        </div>
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
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-block bg-white text-black px-10 py-3.5 text-xs font-medium uppercase tracking-[0.25em] hover:bg-neutral-900 hover:text-white transition duration-300 shadow-2xl"
          >
            Shop Collection
          </Link>

          <button
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-white transition py-2 px-4"
          >
            <span className="w-6 h-6 rounded-full border border-white/40 flex items-center justify-center text-[10px]">
              ▶
            </span>
            Discover Film
          </button>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-3xl hover:opacity-75 transition"
            >
              ✕
            </button>
            <video
              src={discoverVideo}
              controls
              autoPlay
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}