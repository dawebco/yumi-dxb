import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../firebase/productService";
import { useCart } from "../../context/CartContext";
import { FiHeart } from "react-icons/fi";

// Fallback high-fashion products in case database is empty or loading
import model1 from "../../assets/images/products/azure-bloom-model.png";
import model2 from "../../assets/images/products/black-model.png";
import model3 from "../../assets/images/products/crimson-bloom-model.png";
import model4 from "../../assets/images/products/desert-rose-model.png";

const FALLBACK_BESTSELLERS = [
  {
    id: "midi-dress",
    name: "Classic Silk Midi Dress",
    price: 6500,
    image: model2,
  },
  {
    id: "maxi-dress",
    name: "Signature White Maxi",
    price: 8400,
    image: model1,
  },
  {
    id: "starlight-abaya",
    name: "Starlight Embellished Abaya",
    price: 6800,
    image: model3,
  },
  {
    id: "cloud-kaftan",
    name: "Cloud Tiered Kaftan",
    price: 7000,
    image: model4,
  },
];

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(saved);
    } catch {
      setWishlist([]);
    }
  }, []);

  async function loadProducts() {
    try {
      const data = await getAllProducts();
      const best = (data || []).filter((p) => p.bestSeller === true).slice(0, 4);
      if (best.length > 0) {
        setProducts(best);
      } else if (data && data.length > 0) {
        setProducts(data.slice(0, 4));
      } else {
        setProducts(FALLBACK_BESTSELLERS);
      }
    } catch {
      setProducts(FALLBACK_BESTSELLERS);
    }
  }

  const toggleWishlist = (productId) => {
    const next = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };

  const handleQuickAdd = async (product) => {
    try {
      await addToCart(product, "M", 1);
      alert(`${product.name} added to your bag!`);
    } catch {
      // fallback
    }
  };

  const displayList = products.length > 0 ? products : FALLBACK_BESTSELLERS;

  return (
    <section className="py-16 sm:py-24 bg-white text-neutral-900 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[#7E222A] tracking-tight">
            Bestsellers
          </h2>

          <Link
            to="/best-sellers"
            className="px-6 py-2 border border-neutral-800 text-xs font-medium uppercase tracking-[0.15em] hover:bg-black hover:text-white transition duration-300"
          >
            View All
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayList.map((product) => {
            const isWish = wishlist.includes(product.id);
            const imageSrc =
              product.images?.[0] || product.image || FALLBACK_BESTSELLERS[0].image;

            return (
              <div key={product.id} className="group flex flex-col">
                {/* Image Container with Wishlist Icon */}
                <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                  <Link to={`/product/${product.id}`} className="block h-full w-full">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Wishlist Toggle Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition shadow-sm hover:scale-110 ${
                      isWish ? "text-[#7E222A]" : "text-neutral-600 hover:text-black"
                    }`}
                    aria-label="Wishlist"
                  >
                    <FiHeart
                      className={`text-sm ${isWish ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                {/* Product Meta */}
                <div className="pt-4 pb-2 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-sm font-medium text-neutral-900 hover:text-[#7E222A] transition line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-neutral-800">
                      ₹{Number(product.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Add to Bag Outline Button (matching "В корзину" in mockup) */}
                  <button
                    onClick={() => handleQuickAdd(product)}
                    className="mt-4 w-full py-2.5 border border-neutral-300 text-xs uppercase tracking-[0.15em] font-medium text-neutral-800 hover:border-black hover:bg-black hover:text-white transition duration-300"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}