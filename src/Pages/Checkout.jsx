import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { cart } = useOutletContext();
  const cartTotal = cart.reduce(
    (total, product) =>
      total +
      product.price *
        (1 - product.discountPercentage / 100) *
        (product.quantity || 1),
    0,
  );

  if (cart.length === 0) {
    return (
      <main className="checkout-page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link className="checkout-link" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1>Checkout</h1>
      <section className="checkout-summary" aria-label="Order summary">
        <h2>Order summary</h2>
        {cart.map((product) => {
          const discountedPrice =
            product.price * (1 - product.discountPercentage / 100);
          const quantity = product.quantity || 1;

          return (
            <div className="checkout-item" key={product.id}>
              <span>
                {product.title} × {quantity}
              </span>
              <span>${(discountedPrice * quantity).toFixed(2)}</span>
            </div>
          );
        })}
        <p className="checkout-total">
          Total: <strong>${cartTotal.toFixed(2)}</strong>
        </p>
        <p className="checkout-note">
          Payment processing is not available yet.
        </p>
      </section>
      <Link className="checkout-link" to="/cart">
        Back to cart
      </Link>
    </main>
  );
};

export default Checkout;
