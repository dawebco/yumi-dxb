import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { logout } from "../../services/authService";
import { useCart } from "../../context/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

import AnnouncementBar from "./AnnouncementBar";
import SearchBar from "./SearchBar";
import logo from "../../assets/images/logo/logo.png";
import featuredCollection from "../../assets/images/collections/featured-collection.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  
  
  const { user, accountOpen, setAccountOpen } = useAuth();
  const { totalItems } = useCart();

  

useEffect(() => {
  function handleClickOutside(event) {
    if (
      shopMenuRef.current &&
      !shopMenuRef.current.contains(event.target)
    ) {
      setShopOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
useEffect(() => {
  const updateWishlist = () => {
    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlistCount(wishlist.length);
  };

  updateWishlist();

  window.addEventListener("storage", updateWishlist);

  return () => {
    window.removeEventListener("storage", updateWishlist);
  };
}, []);

useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 40) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isHome
            ? scrolled
              ? "bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm text-neutral-900 -mb-20"
              : "bg-gradient-to-b from-black/60 via-black/20 to-transparent border-b border-transparent shadow-none text-white -mb-20"
            : "bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm text-neutral-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-20 flex items-center justify-between">
            {/* Brand Logo / Wordmark */}
            <Link to="/" className="flex items-center gap-3 group">
              <span className="font-editorial text-2xl sm:text-3xl tracking-[0.25em] uppercase font-medium">
                YUMI
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase opacity-70 hidden sm:inline-block border-l border-current pl-3">
                DXB FASHION
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10 text-xs uppercase tracking-[0.2em] font-medium">
              <Link
                to="/shop"
                className="relative group transition-opacity hover:opacity-75"
              >
                Catalog
                <span className="absolute left-0 -bottom-1 w-0 h-[1.5px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Shop */}

              <div
                className="relative"
                ref={shopMenuRef}
                
              >

               <button
  onClick={() => setShopOpen(!shopOpen)}
  className="flex items-center gap-1 group"
>

                  Shop

                  <FiChevronDown
                    className={`transition duration-300 ${
                      shopOpen ? "rotate-180" : ""
                    }`}
                  />

                </button>

              {shopOpen && (
  <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[760px] bg-white rounded-3xl shadow-2xl border border-[#ECE8E3] overflow-hidden">

    <div className="grid grid-cols-2">

      {/* Left */}
      <div className="p-10">

        <p className="uppercase tracking-[4px] text-xs text-[#8A8178] mb-6">
          Shop Collections
        </p>

        <div className="space-y-5">

          <Link to="/shop" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            All Products
          </Link>

          <Link to="/nightwear" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            Nightwear
          </Link>

          <Link to="/Abayas" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            Abayas
          </Link>

          <Link to="/Kaftans" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            Kaftans
          </Link>

          <Link to="/coord-sets" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            Co-ord Sets
          </Link>

          <Link to="/new-arrivals" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            New Arrivals
          </Link>

          <Link to="/best-sellers" onClick={() => setShopOpen(false)} className="block hover:text-[#C3A274] transition">
            Best Sellers
          </Link>

        </div>

      </div>

      {/* Right */}
      <div className="bg-[#F8F5F1] p-8">

        <img
          src={featuredCollection}
          alt="Featured Collection"
          className="w-full h-[220px] object-cover object-top rounded-2xl"
        />

        <h3 className="text-3xl font-serif mt-5 text-[#2E2A27]">
          Featured Collection
        </h3>

        <p className="mt-3 text-[#6F6A65] leading-7">
          Discover timeless silhouettes designed with comfort,
          elegance and everyday luxury in mind.
        </p>

        <Link
  to="/shop"
  onClick={() => setShopOpen(false)}
  className="inline-block mt-5 text-[#465348] font-medium hover:text-[#C3A274]"
>
  Explore Collection →
</Link>

      </div>

    </div>

  </div>
)}
              </div>

              <Link
                to="/about-us"
                className="relative group"
              >
                About Us

                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C3A274] transition-all duration-300 group-hover:w-full"></span>

              </Link>

              <Link
                to="/contact"
                className="relative group"
              >
                Contact & Review

                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#C3A274] transition-all duration-300 group-hover:w-full"></span>

              </Link>

            </nav>

            

              {/* Right Icons */}

            <div className="hidden lg:flex items-center gap-6">

              <button
                onClick={() => setSearchOpen(true)}
                className="hover:text-[#C3A274] transition text-xl"
              >
                <FiSearch />
              </button>

              <button
                onClick={() => setAccountOpen(true)}
                className="hover:text-[#C3A274] transition text-xl"
              >
                <FiUser />
              </button>

              <Link
  to="/wishlist"
  className="relative hover:text-[#C3A274] transition text-xl"
>
  <FiHeart />

 {wishlistCount > 0 && (
  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#465348] text-white text-[10px] flex items-center justify-center">
    {wishlistCount}
  </span>
)}
</Link>

<Link
  to="/cart"
  className="relative hover:text-[#C3A274] transition text-xl"
>
  <FiShoppingBag />

  {totalItems > 0 && (
    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#465348] text-white text-[10px] flex items-center justify-center">
      {totalItems}
    </span>
  )}
</Link>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden"
              >
                <FiMenu />
              </button>

            </div>

                        {/* Mobile Menu Button */}

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-3xl"
            >
              <FiMenu />
            </button>

          </div>

        </div>

      </header>

      {/* ---------------- SEARCH ---------------- */}

      <SearchBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ---------------- ACCOUNT ---------------- */}

      {/* ---------------- ACCOUNT ---------------- */}

{accountOpen && (

  <div className="fixed inset-0 z-[999]">

    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setAccountOpen(false)}
    ></div>

    <div className="absolute right-4 sm:right-8 top-20 sm:top-28 w-[calc(100%-2rem)] sm:w-80 max-w-sm bg-white rounded-3xl shadow-2xl p-8 z-10 transition-all">

      <button
        onClick={() => setAccountOpen(false)}
        className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-700 transition p-1"
        aria-label="Close"
      >
        <FiX size={20} />
      </button>

      {user ? (
        <>
          <h2 className="text-3xl font-serif text-[#2E2A27]">
            Welcome 👋
          </h2>

          <p className="mt-3 text-[#777]">
            {user.displayName || user.email}
          </p>

          <Link
            to="/profile"
            onClick={() => setAccountOpen(false)}
            className="block mt-8 w-full text-center py-3 rounded-full border border-[#2E2A27] hover:bg-[#2E2A27] hover:text-white transition font-medium"
          >
            My Profile
          </Link>

          <button
            onClick={async () => {
              await logout();
              setAccountOpen(false);
              navigate("/login", { replace: true });
            }}
            className="block mt-4 w-full text-center py-3 rounded-full bg-[#465348] text-white hover:bg-[#39443A] transition font-medium"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-serif text-[#2E2A27]">
            Welcome
          </h2>

          <p className="mt-2 text-[#777]">
            Login to access your account.
          </p>

          <Link
            to="/login"
            onClick={() => setAccountOpen(false)}
            className="block mt-8 w-full text-center py-3 rounded-full bg-[#465348] text-white hover:bg-[#39443A] transition font-medium"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setAccountOpen(false)}
            className="block mt-4 w-full text-center py-3 rounded-full border border-[#2E2A27] hover:bg-[#2E2A27] hover:text-white transition font-medium"
          >
            Create Account
          </Link>
        </>
      )}

    </div>

  </div>

)}
      {/* ---------------- CART ---------------- */}

      {cartOpen && (

        <div className="fixed inset-0 z-[999]">

          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          ></div>

          <div className="absolute right-0 top-0 h-full w-[430px] bg-white shadow-2xl flex flex-col">

            <div className="flex justify-between items-center p-8 border-b">

              <h2 className="text-3xl font-serif">
                Shopping Bag
              </h2>

              <button
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>

            </div>

            <div className="flex-1 flex items-center justify-center">

              <div className="text-center">

                <FiShoppingBag
                  className="mx-auto text-5xl text-gray-300"
                />

                <p className="mt-6 text-gray-500">
                  Your shopping bag is empty.
                </p>

              </div>

            </div>

            <div className="p-8 border-t">

              <Link
                to="/shop"
                className="block text-center py-3 rounded-full bg-[#465348] text-white hover:bg-[#39443A]"
              >
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      )}

      {/* ---------------- MOBILE MENU ---------------- */}

      {mobileOpen && (

        <div className="fixed inset-0 z-[999] lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl">

            <div className="flex justify-between items-center p-8 border-b">

              <h2 className="text-3xl font-serif">
                YUMI
              </h2>

              <button
                onClick={() => setMobileOpen(false)}
              >
                <FiX size={28} />
              </button>

            </div>

           <nav className="flex flex-col p-8 gap-6 text-lg">

  <Link to="/" onClick={() => setMobileOpen(false)}>
    Home
  </Link>

  <Link to="/shop" onClick={() => setMobileOpen(false)}>
    Shop
  </Link>

  <Link to="/our-story" onClick={() => setMobileOpen(false)}>
    Our Story
  </Link>

  <Link to="/contact" onClick={() => setMobileOpen(false)}>
    Contact
  </Link>

  <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
    Wishlist ❤️ 
  </Link>

  <Link to="/cart" onClick={() => setMobileOpen(false)}>
    Cart 🛍️ 
  </Link>

  {user ? (
    <>
      <Link to="/profile" onClick={() => setMobileOpen(false)}>
         My Profile
      </Link>

      <button
        onClick={async () => {
          await logout();
          setMobileOpen(false);
          navigate("/signup", { replace: true });
        }}
        className="text-left text-red-600"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link to="/login" onClick={() => setMobileOpen(false)}>
        Login
      </Link>

      <Link to="/signup" onClick={() => setMobileOpen(false)}>
        Create Account
      </Link>
    </>
  )}

</nav>
          </div>

        </div>

      )}

    </>
  );
}