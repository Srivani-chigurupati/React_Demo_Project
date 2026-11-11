import React from "react";
import { useOutletContext } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";

const Wishlist = () => {
  const {
    cart,
    wishlist,
    toggleWishlist,
    addToCart,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useOutletContext();

  return (
    <main className="container py-4">
      <h1 className="mb-4">Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="alert alert-secondary">Your wishlist is empty.</p>
      ) : (
        <ProductGrid
          products={wishlist}
          cart={cart}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onIncrementCartQuantity={incrementCartQuantity}
          onDecrementCartQuantity={decrementCartQuantity}
        />
      )}
    </main>
  );
};

export default Wishlist;
