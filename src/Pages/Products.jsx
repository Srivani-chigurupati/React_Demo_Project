import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductGrid from "../Components/ProductGrid";

const Products = () => {
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

  return (
    <div>
      {loading && <p>Loading products...</p>}
      {error && <p role="alert">{error}</p>}
      <ProductGrid
        products={products}
        cart={cart}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onIncrementCartQuantity={incrementCartQuantity}
        onDecrementCartQuantity={decrementCartQuantity}
      />
    </div>
  );
};

export default Products;
