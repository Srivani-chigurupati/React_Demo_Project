import { useEffect, useState } from "react";
import getProducts from "../services/ProductService";

const useProductStore = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(timeoutId);
  }, [toastMessage]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const loadedProducts = await getProducts(controller.signal);
        setProducts(loadedProducts);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Could not load products",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.some((item) => item.id === product.id);

    setWishlist((items) =>
      isWishlisted
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    );

    setToastMessage(
      `${product.title} ${isWishlisted ? "removed from" : "added to"} wishlist`,
    );
  };

  const addToCart = (product) => {
    const alreadyInCart = cart.some((item) => item.id === product.id);

    setCart((items) => {
      const existingItem = items.find((item) => item.id === product.id);

      return existingItem
        ? items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item,
          )
        : [...items, { ...product, quantity: 1 }];
    });

    if (!alreadyInCart) {
      setToastMessage(`${product.title} added to cart`);
    }
  };

  const incrementCartQuantity = (product) => {
    setCart((items) =>
      items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item,
      ),
    );
  };

  const removeFromCart = (product) => {
    const alreadyInCart = cart.some((item) => item.id === product.id);
    setCart((items) =>
      alreadyInCart
        ? items.filter((item) => item.id !== product.id)
        : items,
    );

    if (alreadyInCart) {
      setToastMessage(`${product.title} removed from cart`);
    }
  };

  const decrementCartQuantity = (product) => {
    const item = cart.find((cartItem) => cartItem.id === product.id);
    if (!item) {
      return;
    }

    const quantity = item.quantity || 1;
    if (quantity <= 1) {
      removeFromCart(product);
      return;
    }

    setCart((items) =>
      items.map((cartItem) =>
        cartItem.id === product.id
          ? { ...cartItem, quantity: quantity - 1 }
          : cartItem,
      ),
    );
  };

  return {
    products,
    wishlist,
    cart,
    loading,
    error,
    toastMessage,
    toggleWishlist,
    addToCart,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
  };
};

export default useProductStore;
