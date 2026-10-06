export default function MarqueeTicker() {
  const items = [
    "FREE SHIPPING ON ORDERS OVER ₹2,500",
    "CASH ON DELIVERY AVAILABLE",
    "7-DAY EASY RETURNS & EXCHANGES",
    "HANDCRAFTED LUXURY FABRICS",
    "WHERE COMFORT MEETS ELEGANCE",
    "DESIGNED BY TWO SISTERS",
    "100% PREMIUM QUALITY GUARANTEE",
  ];

  return (
    <div className="bg-black text-white py-3.5 border-y border-neutral-900 overflow-hidden select-none relative z-20">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs sm:text-sm tracking-[0.25em] uppercase font-light">
        {items.concat(items).map((text, idx) => (
          <span key={idx} className="flex items-center gap-8">
            <span>{text}</span>
            <span className="text-[#C8A26A] text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
