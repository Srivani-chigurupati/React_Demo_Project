export const PRODUCTS_STORAGE_KEY = "my-demo-app-products-v1";
export const ORDERS_STORAGE_KEY = "my-demo-app-orders-v1";
export const WISHLIST_STORAGE_KEY = "my-demo-app-wishlist-v1";
export const CART_STORAGE_KEY = "my-demo-app-cart-v1";

export const isProductList = (value) =>
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

export const readSavedOrders = () => {
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

const readSavedProductList = (
  storageKey,
  itemName,
  collectionName,
  fallbackMessage,
) => {
  if (!storageKey) {
    return { [collectionName]: [], error: "" };
  }

  try {
    const savedItems = localStorage.getItem(storageKey);
    if (savedItems === null) {
      return { [collectionName]: [], error: "" };
    }

    const parsedItems = JSON.parse(savedItems);
    if (!isProductList(parsedItems)) {
      throw new Error(`Saved ${itemName} data is invalid.`);
    }
    return { [collectionName]: parsedItems, error: "" };
  } catch (err) {
    return {
      [collectionName]: [],
      error:
        err instanceof Error ? err.message : fallbackMessage,
    };
  }
};

export const readSavedWishlist = (storageKey) =>
  readSavedProductList(
    storageKey,
    "wishlist",
    "wishlist",
    "Could not load saved wishlist.",
  );

export const readSavedCartlist = (storageKey) =>
  readSavedProductList(
    storageKey,
    "Cart",
    "cartlist",
    "Could not load saved cartlist.",
  );
