import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    wishlist,
    toggleWishlist,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useOutletContext();
  const cartTotal = cart.reduce(
    (total, product) =>
      total +
      product.price *
        (1 - product.discountPercentage / 100) *
        (product.quantity || 1),
    0,
  );

  return (
    <main>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ProductGrid
          products={cart}
          cart={cart}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onRemoveFromCart={removeFromCart}
          onIncrementCartQuantity={incrementCartQuantity}
          onDecrementCartQuantity={decrementCartQuantity}
        />
      )}
      {cart.length > 0 && (
        <section className="cart-summary">
          <p>
            Total: <strong>${cartTotal.toFixed(2)}</strong>
          </p>
          <Link className="checkout-button" to="/checkout">
            Proceed to Checkout
          </Link>
        </section>
      )}
    </main>
  );
};

export default Cart;
