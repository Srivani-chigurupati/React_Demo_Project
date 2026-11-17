import React from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../../catalog/components/ProductGrid";
import useProductStoreContext from "../../catalog/hooks/useProductStoreContext";
import "./Cart.css";

const Cart = () => {
  const {
    cart,
    wishlist,
    cartlistError,
    toggleWishlist,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useProductStoreContext();
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
      {cartlistError && (
        <p className="alert alert-danger" role="alert">
          Cartlist storage error: {cartlistError}
        </p>
      )}
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
