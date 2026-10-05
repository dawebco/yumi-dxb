import { Link } from "react-router-dom";
import { useState } from "react";
import heroVideo from "../../assets/videos/hero.mp4";
import discoverVideo from "../../assets/videos/discover.mp4";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <section className="relative min-h-screen bg-[#FAF8F5] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-center"
        />

        {/* 
          Tuned Gradient: 
          Keeps high opacity only on the immediate left where the text sits, 
          then rapidly fades out before the middle of the screen.
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/95 from-0% via-[#FAF8F5]/60 via-35% to-transparent to-55%" />

        {/* Bottom fade into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-b from-transparent to-[#FAF8F5]" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-8 min-h-screen flex items-center">
        <div className="max-w-2xl">
          {/* Main Heading */}
          <h1 className="font-serif text-[#232323] leading-none drop-shadow-sm">
            <span className="block text-6xl md:text-7xl">
              Where Comfort
            </span>
            <span className="block mt-3 text-6xl md:text-7xl">
              Meets{" "}
              <span className="italic text-[#C8A26A] drop-shadow-sm">
                Elegance
              </span>
            </span>
          </h1>

          {/* Divider */}
          <div className="flex items-center gap-5 mt-10">
            <div className="w-20 h-[1px] bg-[#C8A26A]"></div>
            <div className="w-3 h-3 rounded-full bg-[#C8A26A]"></div>
            <div className="w-20 h-[1px] bg-[#C8A26A]"></div>
          </div>

          {/* Description */}
          <p className="mt-10 text-lg leading-9 text-[#5a534d] max-w-xl font-medium drop-shadow-sm">
            Thoughtfully designed for every woman.
            <br />
            Crafted with love by two sisters who believe fashion should feel as beautiful as it looks.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex gap-5">
            <Link 
              to="/shop"
              className="rounded-full bg-[#465348] px-8 py-3 text-white hover:bg-[#39443A] transition shadow-md"
            >
              Shop Collections
            </Link>
            <a
              href="#our-story"
              className="px-10 py-4 border border-[#2E2A27] rounded-full hover:bg-[#2E2A27] hover:text-white transition bg-white/20 backdrop-blur-sm"
            >
              Our Story
            </a>
          </div>

          {/* Discover */}
          <div className="mt-12 flex items-center gap-5 group cursor-pointer" onClick={() => setShowVideo(true)}>
            <div className="relative flex items-center justify-center w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-[#B89B72] animate-ping opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
              
              <button className="relative w-16 h-16 rounded-full bg-white/50 backdrop-blur-md border border-[#B89B72] flex items-center justify-center transition-all duration-300 group-hover:bg-[#B89B72] group-hover:scale-105 shadow-sm group-hover:shadow-md">
                <svg 
                  className="w-5 h-5 text-[#B89B72] group-hover:text-white ml-1 transition-colors duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            
            <span className="uppercase tracking-[3px] text-sm font-medium drop-shadow-sm group-hover:text-[#B89B72] transition-colors duration-300">
              Discover YUMI
            </span>
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="w-7 h-12 rounded-full border border-[#B89B72] flex justify-center bg-white/20 backdrop-blur-sm">
          <div className="w-[3px] h-3 bg-[#B89B72] rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[90%] max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white text-4xl hover:scale-110 transition-transform"
            >
              ×
            </button>
            <video
              src={discoverVideo}
              controls
              autoPlay
              className="w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
}