import { useEffect, useState } from "react";
import getProducts from "../services/ProductService";

const PRODUCTS_STORAGE_KEY = "my-demo-app-products-v1";
const ORDERS_STORAGE_KEY = "my-demo-app-orders-v1";

const isOrderList = (value) =>
  Array.isArray(value) &&
  value.every(
    (order) =>
      order &&
      typeof order.id === "string" &&
      typeof order.userId === "number" &&
      typeof order.placedAt === "string" &&
      Array.isArray(order.items) &&
      typeof order.total === "number",
  );

const readSavedOrders = () => {
  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (savedOrders === null) {
      return { orders: [], error: "" };
    }

    const parsedOrders = JSON.parse(savedOrders);
    if (!isOrderList(parsedOrders)) {
      throw new Error("Saved order data is invalid.");
    }
    return { orders: parsedOrders, error: "" };
  } catch (err) {
    return {
      orders: [],
      error:
        err instanceof Error ? err.message : "Could not load saved orders.",
    };
  }
};

const isProductList = (value) =>
  Array.isArray(value) &&
  value.every(
    (product) =>
      product &&
      typeof product.id === "number" &&
      typeof product.title === "string" &&
      typeof product.price === "number" &&
      typeof product.category === "string" &&
      Array.isArray(product.images),
  );

export const useProductStore = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
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

  const saveProducts = (nextProducts) => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(nextProducts));
    setProducts(nextProducts);
  };

  const addProduct = (productData) => {
    const nextId =
      products.reduce(
        (largestId, product) => Math.max(largestId, product.id),
        0,
      ) + 1;
    //const nextId = Math.max(0, ...products.map((product) => product.id)) + 1;
    const newProduct = { ...productData, id: nextId };
    saveProducts([...products, newProduct]);
    setToastMessage(`${newProduct.title} added to products`);
    return newProduct;
  };

  const updateProduct = (productId, productData) => {
    const existingProduct = products.find(
      (product) => product.id === productId,
    );
    if (!existingProduct) {
      throw new Error("Product no longer exists.");
    }

    const updatedProduct = {
      ...existingProduct,
      ...productData,
      id: productId,
    };
    saveProducts(
      products.map((product) =>
        product.id === productId ? updatedProduct : product,
      ),
    );
    setWishlist((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, ...updatedProduct } : item,
      ),
    );
    setCart((items) =>
      items.map((item) =>
        item.id === productId ? { ...item, ...updatedProduct } : item,
      ),
    );
    setToastMessage(`${updatedProduct.title} updated`);
    return updatedProduct;
  };

  const deleteProduct = (productId) => {
    const productToDelete = products.find(
      (product) => product.id === productId,
    );
    if (!productToDelete) {
      throw new Error("Product no longer exists.");
    }

    saveProducts(products.filter((product) => product.id !== productId));
    setWishlist((items) => items.filter((item) => item.id !== productId));
    setCart((items) => items.filter((item) => item.id !== productId));
    setToastMessage(`${productToDelete.title} deleted`);
  };

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
      alreadyInCart ? items.filter((item) => item.id !== product.id) : items,
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

  const placeOrder = ({ customer, shippingAddress, paymentMethod }) => {
    if (ordersError) {
      throw new Error(
        `Cannot place an order because saved orders could not be loaded: ${ordersError}`,
      );
    }
    if (cart.length === 0) {
      throw new Error("Your cart is empty.");
    }

    const items = cart.map((product) => {
      const quantity = product.quantity || 1;
      const unitPrice =
        Math.round(
          product.price * (1 - (product.discountPercentage || 0) / 100) * 100,
        ) / 100;

      return {
        productId: product.id,
        title: product.title,
        image: product.images?.[0] || product.thumbnail || "",
        quantity,
        unitPrice,
        lineTotal: Math.round(unitPrice * quantity * 100) / 100,
      };
    });
    const total = Math.round(
      items.reduce((sum, item) => sum + item.lineTotal, 0) * 100,
    ) / 100;
    const order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      userId: customer.id,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      shippingAddress: { ...shippingAddress },
      paymentMethod,
      items,
      subtotal: total,
      shipping: 0,
      total,
      status: "Placed",
      placedAt: new Date().toISOString(),
    };
    const nextOrders = [order, ...orders];

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(nextOrders));
    setOrders(nextOrders);
    setOrdersError("");
    setCart([]);
    setToastMessage(`Order ${order.id} placed`);
    return order;
  };

  return {
    products,
    wishlist,
    cart,
    orders,
    ordersError,
    loading,
    error,
    toastMessage,
    toggleWishlist,
    addToCart,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
    placeOrder,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
