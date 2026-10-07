import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  addToCart as addCartItem,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearFirebaseCart,
} from "../firebase/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, setAccountOpen } = useAuth();

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    loadCart();
  }, [user]);

  async function loadCart() {
    if (!user) return;

    const data = await getCart(user.uid);
    setItems(data);
  }

  async function addToCart(product, size, quantity = 1) {
    console.log("USER:", user);
    console.log("PRODUCT:", product);
    if (!user) {
      setAccountOpen(true);
      return false;
    }

  const cartData = {
    userId: user.uid,
    productId: product.id,
    name: product.name,
    image: product.images?.[0] || "",
    price: product.price,
    size,
    quantity,
};

console.log("Cart Data:", cartData);

await addCartItem(cartData);

    await loadCart();
    return true;
  }

  async function updateQuantity(
    documentId,
    quantity
  ) {
    if (quantity < 1) return;

    await updateCartItem(documentId, quantity);

    await loadCart();
  }
    async function removeFromCart(documentId) {
    await removeCartItem(documentId);

    await loadCart();
  }

  async function clearCart() {
    if (!user) return;

    await clearFirebaseCart(user.uid);

    setItems([]);
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}