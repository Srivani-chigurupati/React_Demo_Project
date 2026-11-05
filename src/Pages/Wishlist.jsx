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
    <main>
      <h1>Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
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
