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
      <main className="container checkout-page py-4">
        <h1 className="mb-4">Checkout</h1>
        <p className="alert alert-secondary">Your cart is empty.</p>
        <Link className="checkout-link btn btn-outline-primary" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container checkout-page py-4">
      <h1 className="mb-4">Checkout</h1>
      <section className="checkout-summary card p-4" aria-label="Order summary">
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
      <Link className="checkout-link btn btn-outline-primary" to="/cart">
        Back to cart
      </Link>
    </main>
  );
};

export default Checkout;
