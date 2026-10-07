import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";

import {
  addToWishlist,
  removeWishlistItem,
  getWishlistItem,
} from "../../firebase/wishlistService";

import { auth } from "../../firebase/firebase";
import { getProductById, SIZE_OPTIONS } from "../../firebase/productService";
import { getProductReviews } from "../../firebase/reviewService";
import { useCart } from "../../context/CartContext";
import Loader from "../../components/common/Loader";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { useAuth } from "../../context/AuthContext";
import RelatedProducts from "../../components/customer/RelatedProducts";
import { getEstimatedDelivery } from "../../utils/deliveryDate";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, setAccountOpen } = useAuth();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const [productData, reviewData] = await Promise.all([
        getProductById(id),
        getProductReviews(id),
      ]);

      if (!isMounted) return;

      setProduct(productData);
setReviews(reviewData);

// ⭐ Add this
if (productData) {
  addRecentlyViewed(productData);
}

      if (productData?.sizes) {
        const firstInStock = SIZE_OPTIONS.find(
          (s) => (productData.sizes[s]?.stock ?? 0) > 0
        );
        setSize(firstInStock || SIZE_OPTIONS[0]);
      }

      setLoading(false);
      const user = auth.currentUser;

if (user && productData) {
  const existing = await getWishlistItem(
    user.uid,
    productData.id
  );

  if (existing) {
    setWishlisted(true);
    setWishlistId(existing.id);
  }
}
    
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <main className="bg-[#FAF8F5] pt-40 pb-24 text-center">
        <p className="text-[#6A625B] text-lg">Product not found.</p>
      </main>
    );
  }

  const images = product.images?.length ? product.images : [];
  const stockForSize = product.sizes?.[size]?.stock ?? 0;
  const isOutOfStock = stockForSize === 0;

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
    const estimatedDelivery = getEstimatedDelivery();
const handleWishlist = async () => {
  const currentUser = auth.currentUser || user;

  if (!currentUser) {
    setAccountOpen(true);
    return;
  }

  try {
    if (wishlisted) {
      await removeWishlistItem(wishlistId);

      setWishlisted(false);
      setWishlistId(null);
    } else {
      await addToWishlist({
        userId: currentUser.uid,
        productId: product.id,
        name: product.name,
        image: product.images?.[0],
        price: product.discountActive
  ? product.discountedPrice
  : product.price,
      });

      const addedItem = await getWishlistItem(
        currentUser.uid,
        product.id
      );

      if (addedItem) {
        setWishlisted(true);
        setWishlistId(addedItem.id);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const handleAddToCart = async () => {
  console.log("Button Clicked");

  if (!size || isOutOfStock) {
    console.log("Size not selected or out of stock");
    return;
  }

  const currentUser = auth.currentUser || user;
  if (!currentUser) {
    setAccountOpen(true);
    return;
  }

  try {
    const finalProduct = {
      ...product,
      price: product.discountActive
        ? product.discountedPrice
        : product.price,
    };

    const success = await addToCart(finalProduct, size, quantity);
    if (success === false) return;

    console.log("Added Successfully");

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  } catch (err) {
    console.error("Add To Cart Error:", err);
  }
};

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return "";
    return timestamp.toDate().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="bg-[#FAF8F5] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <div>
          <div className="rounded-[32px] overflow-hidden bg-white">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-[700px] object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-4 mt-6">
              {images.map((img, i) => (
                <img
                  key={img}
                  src={img}
                  alt=""
                  onClick={() => setActiveImage(i)}
                  className={`w-24 h-24 rounded-2xl object-cover border cursor-pointer transition ${
                    activeImage === i ? "border-[#465348] border-2" : ""
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="uppercase tracking-[4px] text-[#B89B72]">
            {product.category}
          </p>

          <h1 className="mt-3 text-5xl font-serif text-[#2E2A27]">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mt-5">
            <span className="text-yellow-500">
              {"★".repeat(Math.round(avgRating))}
              {"☆".repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-[#6A625B]">
              {reviews.length > 0
                ? `${avgRating.toFixed(1)} (${reviews.length} Review${reviews.length > 1 ? "s" : ""})`
                : "No reviews yet"}
            </span>
          </div>

          <div className="mt-8">
  {product.discountActive ? (
    <>
      <p className="text-xl text-gray-400 line-through">
        ₹{product.price?.toLocaleString()}
      </p>

      <h2 className="text-4xl font-semibold text-green-600">
  ₹{product.discountedPrice?.toLocaleString()}
</h2>

      <span className="inline-block mt-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
  {product.discountValue}% OFF
</span>
    </>
  ) : (
  <h2 className="text-4xl font-semibold text-[#465348]">
    ₹{product.price?.toLocaleString()}
  </h2>
)}
</div>

          <p className="mt-8 leading-8 text-[#6A625B]">
            {product.description}
          </p>

          {product.fabric && (
            <div className="mt-10">
              <h3 className="font-semibold text-lg">Fabric</h3>
              <p className="mt-2 text-[#6A625B]">{product.fabric}</p>
            </div>
          )}

          {product.careInstructions && (
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Care Instructions</h3>
              <p className="mt-2 text-[#6A625B]">{product.careInstructions}</p>
            </div>
          )}

          {/* Sizes */}
          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-4">Select Size</h3>

            <div className="flex gap-3">
              {SIZE_OPTIONS.map((item) => {
                const stock = product.sizes?.[item]?.stock ?? 0;
                const disabled = stock === 0;

                return (
                  <button
                    key={item}
                    disabled={disabled}
                    onClick={() => {
                      setSize(item);
                      setQuantity(1);
                    }}
                    className={`w-12 h-12 rounded-full border transition relative ${
                      size === item
                        ? "bg-[#465348] text-white"
                        : disabled
                        ? "bg-[#F4F0EB] text-[#C4BEB6] cursor-not-allowed line-through"
                        : "bg-white"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {size && (
              <p className={`mt-3 text-sm ${isOutOfStock ? "text-red-600" : "text-[#8A8178]"}`}>
                {isOutOfStock
                  ? "Out of stock in this size"
                  : `${stockForSize} in stock`}
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-10">
            <h3 className="font-semibold text-lg mb-4">Quantity</h3>

            <div className="flex items-center gap-5">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="w-10 h-10 rounded-full border"
              >
                -
              </button>

              <span className="text-xl">{quantity}</span>

              <button
                onClick={() =>
                  quantity < stockForSize && setQuantity(quantity + 1)
                }
                disabled={quantity >= stockForSize}
                className="w-10 h-10 rounded-full border disabled:opacity-40"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 rounded-full bg-[#465348] text-white py-4 hover:bg-[#39443A] transition flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingBag />
              {isOutOfStock ? "Out of Stock" : added ? "Added ✓" : "Add to Cart"}
            </button>

            <button
  onClick={handleWishlist}
  className={`w-16 rounded-full border flex items-center justify-center transition
    ${
      wishlisted
        ? "bg-red-500 text-white border-red-500"
        : "hover:bg-[#465348] hover:text-white"
    }`}
>
  <FiHeart
    fill={wishlisted ? "currentColor" : "none"}
  />
</button>
          </div>

          {added && (
            <button
              onClick={() => navigate("/cart")}
              className="mt-4 text-sm text-[#465348] underline hover:text-[#39443A]"
            >
              View Cart →
            </button>
          )}

         {/* Features */}
<div className="mt-14 space-y-6">

  <div className="flex items-center gap-4">
    <FiTruck size={20} />
    <span>Free Shipping Across India</span>
  </div>

  <div className="bg-[#F8F5F1] rounded-2xl p-5 border border-[#ECE8E3]">
    <p className="text-sm text-[#8A8178]">
      Estimated Delivery
    </p>

    <p className="text-lg font-semibold text-[#2E2A27] mt-1">
      🚚 {estimatedDelivery}
    </p>
  </div>

  <div className="flex items-center gap-4">
    <FiRefreshCw size={20} />
    <span>Easy 7-Day Returns</span>
  </div>

</div>

        </div> {/* End Details */}

</div> {/* End Grid */}

{/* Related Products */}
<div className="max-w-7xl mx-auto px-6 mt-24">
  <RelatedProducts
    category={product.category}
    currentProductId={product.id}
  />
</div>



      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto px-6 mt-24">
        <h2 className="text-3xl font-serif text-[#2E2A27] mb-8">
          Customer Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {reviews.length === 0 ? (
          <p className="text-[#8A8178]">
            No reviews yet. Be the first to share your experience after your order is delivered.
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-[#ECE8E3] p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-[#2E2A27]">{review.userName}</p>
                  <span className="text-yellow-500 text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <p className="text-xs text-[#8A8178] mb-3">{formatDate(review.createdAt)}</p>

                <p className="text-[#4A453F] leading-7">
                  {review.review}
                </p>

                {review.adminReply && (
                  <div className="bg-[#F8F5F1] rounded-xl p-4 mt-4">
                    <p className="text-xs text-[#8A8178] mb-1">YUMI's Reply</p>
                    <p className="text-sm text-[#4A453F]">{review.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}