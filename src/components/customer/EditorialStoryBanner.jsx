import { Link } from "react-router-dom";
import storyImage from "../../assets/images/story/story.png";

export default function EditorialStoryBanner() {
  return (
    <section className="relative w-full bg-neutral-950 text-white overflow-hidden">
      {/* Full-width Editorial Backdrop */}
      <div className="relative min-h-[580px] sm:min-h-[680px] w-full">
        <img
          src={storyImage}
          alt="YUMI Philosophy"
          className="w-full h-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
        />
        {/* Subtle cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/80" />

        {/* Bottom Right Manifesto Box (matching mockup reference) */}
        <div className="absolute bottom-10 sm:bottom-16 right-6 sm:right-16 max-w-xl bg-black/60 backdrop-blur-md p-8 sm:p-10 border border-white/10 text-left">
          <h2 className="text-2xl sm:text-3xl font-editorial tracking-wide uppercase font-medium leading-tight">
            YUMI – More than just clothing
          </h2>

          <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            This philosophy is born from confidence, elegance, and the inner strength of the modern woman. We believe clothing is a language where form, texture, and details speak with quiet luxury and timeless grace.
          </p>

          <div className="mt-8">
            <Link
              to="/our-story"
              className="inline-block px-8 py-3 bg-white text-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-neutral-900 hover:text-white transition duration-300 shadow-xl"
            >
              About the Brand
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
