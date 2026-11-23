import { useEffect, useRef, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import getProducts from "../services/ProductService";
import useProductStoreActions from "./useProductStoreActions";
import {
  CART_STORAGE_KEY,
  PRODUCTS_STORAGE_KEY,
  WISHLIST_STORAGE_KEY,
  isProductList,
  readSavedCartlist,
  readSavedOrders,
  readSavedWishlist,
} from "./productStoreStorage";

export const useProductStore = () => {
  const { user } = useAuth();
  const wishlistStorageKey =
    user?.id != null
      ? `${WISHLIST_STORAGE_KEY}-user-${user.id}`
      : null;
  const cartStorageKey =
    user?.id != null ? `${CART_STORAGE_KEY}-user-${user.id}` : null;
  const [products, setProducts] = useState([]);
  const [initialWishlist] = useState(() =>
    readSavedWishlist(wishlistStorageKey),
  );
  const [initialCartlist] = useState(() => readSavedCartlist(cartStorageKey));
  const [wishlist, setWishlist] = useState(initialWishlist.wishlist);
  const [wishlistError, setWishlistError] = useState(initialWishlist.error);
  const [cartlistError, setCartlistError] = useState(initialCartlist.error);
  const [cart, setCart] = useState(initialCartlist.cartlist);
  const persistedWishlist = useRef(wishlist);
  const persistedCartlist = useRef(cart);
  const [initialOrders] = useState(readSavedOrders);
  const [orders, setOrders] = useState(initialOrders.orders);
  const [ordersError, setOrdersError] = useState(initialOrders.error);
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
    if (!wishlistStorageKey || persistedWishlist.current === wishlist) {
      return;
    }

    try {
      localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlist));
      persistedWishlist.current = wishlist;
      setWishlistError("");
    } catch (err) {
      setWishlistError(
        err instanceof Error ? err.message : "Could not save wishlist.",
      );
    }
  }, [wishlist, wishlistStorageKey]);

  useEffect(() => {
    if (!cartStorageKey || persistedCartlist.current === cart) {
      return;
    }

    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
      persistedCartlist.current = cart;
      setCartlistError("");
    } catch (err) {
      setCartlistError(
        err instanceof Error ? err.message : "Could not save cartlist.",
      );
    }
  }, [cart, cartStorageKey]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (savedProducts !== null) {
          const parsedProducts = JSON.parse(savedProducts);
          if (!isProductList(parsedProducts)) {
            throw new Error("Saved products data is invalid.");
          }
          setProducts(parsedProducts);
          return;
        }

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

  const actions = useProductStoreActions({
    products,
    setProducts,
    wishlist,
    setWishlist,
    cart,
    setCart,
    orders,
    ordersError,
    setOrders,
    setOrdersError,
    setToastMessage,
  });

  return {
    products,
    wishlist,
    wishlistError,
    cart,
    cartlistError,
    orders,
    ordersError,
    loading,
    error,
    toastMessage,
    ...actions,
  };
};
