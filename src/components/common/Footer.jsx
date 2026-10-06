import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "../../firebase/newsletterService";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await subscribeToNewsletter(email);
      alert("Thank you for joining the YUMI private circle!");
      setEmail("");
    } catch (err) {
      alert(err.message || "Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-white text-neutral-900 border-t border-neutral-200">
      {/* Editorial 3-Column Section matching mockup reference */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
          {/* Column 1: Contacts */}
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#7E222A] tracking-tight mb-6">
              Contacts
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 font-light">
              <li>
                <a
                  href="tel:+917349558926"
                  className="hover:text-black transition"
                >
                  +91 73495 58926 (Customer Care)
                </a>
              </li>
              <li>
                <a
                  href="tel:+919591308536"
                  className="hover:text-black transition"
                >
                  +91 95913 08536 (Head Office)
                </a>
              </li>
              <li>
                <a
                  href="mailto:care.yumidxb@gmail.com"
                  className="hover:text-black transition"
                >
                  care.yumidxb@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://www.instagram.com/yumi_dxb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition inline-flex items-center gap-1 font-normal text-neutral-800"
                >
                  Instagram <span>→</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917349558926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition inline-flex items-center gap-1 font-normal text-neutral-800"
                >
                  WhatsApp (+91 73495 58926) <span>→</span>
                </a>
              </li>
              <li className="pt-3 text-[11px] text-neutral-400">
                Mangaluru, Karnataka, India
              </li>
            </ul>
          </div>

          {/* Column 2: Catalog */}
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#7E222A] tracking-tight mb-6">
              Catalog
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 font-light">
              <li>
                <Link to="/shop" className="hover:text-black transition">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/abayas" className="hover:text-black transition">
                  Abayas
                </Link>
              </li>
              <li>
                <Link to="/nightwear" className="hover:text-black transition">
                  Nightwear & Loungewear
                </Link>
              </li>
              <li>
                <Link to="/kaftans" className="hover:text-black transition">
                  Kaftans
                </Link>
              </li>
              <li>
                <Link to="/coord-sets" className="hover:text-black transition">
                  Co-ord Sets
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-black transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-black transition">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#7E222A] tracking-tight mb-6">
              Customer Care
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-600 font-light">
              <li>
                <Link to="/our-story" className="hover:text-black transition">
                  About the Brand
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-black transition">
                  How to Place an Order
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-black transition">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-black transition">
                  7-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-black transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-black transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-medium">
                Newsletter
              </p>
              <div className="flex border border-neutral-300">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3 py-2 text-xs w-full outline-none bg-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-black text-white text-[11px] uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50"
                >
                  {loading ? "..." : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-neutral-100 py-6 text-xs text-neutral-400 font-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2024–2026 YUMI DXB Fashion. All rights reserved.</p>
          <p className="tracking-wide">Where Comfort Meets Elegance</p>
        </div>
      </div>
    </footer>
  );
}