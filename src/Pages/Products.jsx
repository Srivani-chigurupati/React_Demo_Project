import React from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ProductGrid from "../Components/ProductGrid";

const getSearchTokens = (value) =>
  value.toLowerCase().match(/[a-z0-9]+/g) || [];

const matchesSearch = (product, queryTokens) => {
  if (queryTokens.length === 0) {
    return true;
  }

  const productTokens = [product.title, product.brand, product.category]
    .filter(Boolean)
    .flatMap(getSearchTokens);

  return queryTokens.every((queryToken) =>
    productTokens.some((productToken) => productToken.startsWith(queryToken)),
  );
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() || "";
  const activeSearchTerm = searchTerm.length >= 3 ? searchTerm : "";
  const searchTokens = getSearchTokens(activeSearchTerm);
  const {
    products,
    cart,
    wishlist,
    loading,
    error,
    toggleWishlist,
    addToCart,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useOutletContext();

  const visibleProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesProductSearch = matchesSearch(product, searchTokens);

    return matchesCategory && matchesProductSearch;
  });
  const heading = activeSearchTerm
    ? `Search results for "${searchParams.get("q").trim()}"`
    : selectedCategory
      ? selectedCategory
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "All Products";

  return (
    <main className="container py-4 products-page">
      <h1 className="mb-4">{heading}</h1>
      {loading && <p className="alert alert-info">Loading products...</p>}
      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}
      {!loading && !error && visibleProducts.length === 0 && (
        <p className="alert alert-secondary">
          No products found
          {activeSearchTerm
            ? " matching your search"
            : " in this category"}.
        </p>
      )}
      <ProductGrid
        products={visibleProducts}
        cart={cart}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onIncrementCartQuantity={incrementCartQuantity}
        onDecrementCartQuantity={decrementCartQuantity}
      />
    </main>
  );
};

export default Products;
