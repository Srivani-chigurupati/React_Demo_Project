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
    <main className="container py-4">
      <h1 className="mb-4">Cart</h1>
      {cart.length === 0 ? (
        <p className="alert alert-secondary">Your cart is empty.</p>
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
          <Link className="checkout-button btn btn-primary" to="/checkout">
            Proceed to Checkout
          </Link>
        </section>
      )}
    </main>
  );
};

export default Cart;
