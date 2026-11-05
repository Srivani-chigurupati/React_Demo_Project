import React from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

const Products = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
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
  const visibleProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;
  const heading = selectedCategory
    ? selectedCategory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "All Products";

  return (
    <main className="products-page">
      <h1>{heading}</h1>
      {loading && <p>Loading products...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && visibleProducts.length === 0 && (
        <p>No products found in this category.</p>
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
