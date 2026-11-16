import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import useProductStoreContext from "../../catalog/hooks/useProductStoreContext";
import "./Checkout.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const getOrderTotal = (items = []) =>
  Number(
    items.reduce((total, { price = 0, discountPercentage = 0, quantity = 1 }) => {
      const unitPrice = price * (1 - discountPercentage / 100);
      return total + unitPrice * quantity;
    }, 0).toFixed(2),
  );

const Checkout = () => {
  const { user } = useAuth();
  const { cart, ordersError, placeOrder } = useProductStoreContext();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const [form, setForm] = useState(() => ({
    name: userName,
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address?.address || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "",
  }));
  const cartTotal = getOrderTotal(cart);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const order = placeOrder({
        customer: {
          id: user.id,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        shippingAddress: {
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country.trim(),
        },
        paymentMethod: "Pay on delivery",
      });
      navigate(`/order-placed/${encodeURIComponent(order.id)}`, {
        replace: true,
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not place your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="container checkout-page py-4">
        <h1 className="mb-4">Checkout</h1>
        <p className="alert alert-secondary">Your cart is empty.</p>
        <Link className="btn btn-outline-primary" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container checkout-page py-4">
      <h1 className="mb-4">Checkout</h1>
      {ordersError && (
        <p className="alert alert-danger" role="alert">
          Saved orders could not be loaded: {ordersError}
        </p>
      )}
      {formError && (
        <p className="alert alert-danger" role="alert">
          {formError}
        </p>
      )}
      <div className="checkout-layout">
        <form className="checkout-form card p-4" onSubmit={handleSubmit}>
          <fieldset disabled={isSubmitting || Boolean(ordersError)}>
            <legend className="h4 mb-3">Contact and delivery</legend>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label" htmlFor="checkout-name">
                  Full name
                </label>
                <input
                  className="form-control"
                  id="checkout-name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField}
                  required
                  maxLength="120"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-email">
                  Email
                </label>
                <input
                  className="form-control"
                  id="checkout-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  maxLength="254"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-phone">
                  Phone
                </label>
                <input
                  className="form-control"
                  id="checkout-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateField}
                  required
                  maxLength="30"
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="checkout-address">
                  Street address
                </label>
                <input
                  className="form-control"
                  id="checkout-address"
                  name="address"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={updateField}
                  required
                  maxLength="160"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-city">
                  City
                </label>
                <input
                  className="form-control"
                  id="checkout-city"
                  name="city"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={updateField}
                  required
                  maxLength="100"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-state">
                  State / province
                </label>
                <input
                  className="form-control"
                  id="checkout-state"
                  name="state"
                  autoComplete="address-level1"
                  value={form.state}
                  onChange={updateField}
                  required
                  maxLength="100"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-postal">
                  Postal code
                </label>
                <input
                  className="form-control"
                  id="checkout-postal"
                  name="postalCode"
                  autoComplete="postal-code"
                  value={form.postalCode}
                  onChange={updateField}
                  required
                  maxLength="20"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="checkout-country">
                  Country
                </label>
                <input
                  className="form-control"
                  id="checkout-country"
                  name="country"
                  autoComplete="country-name"
                  value={form.country}
                  onChange={updateField}
                  required
                  maxLength="100"
                />
              </div>
            </div>
            <fieldset className="checkout-payment mt-4">
              <legend className="h5">Payment</legend>
              <label className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  value="Pay on delivery"
                  checked
                  readOnly
                />
                <span className="form-check-label">Pay on delivery</span>
              </label>
              <p className="checkout-note mb-0">
                Payment will be collected upon delivery.
              </p>
            </fieldset>
            <button
              className="btn btn-primary w-100 mt-4"
              type="submit"
              disabled={isSubmitting || Boolean(ordersError)}
            >
              {isSubmitting
                ? "Placing order..."
                : `Place order · ${formatPrice(cartTotal)}`}
            </button>
          </fieldset>
        </form>

        <aside className="checkout-summary card p-4" aria-label="Order summary">
          <h2 className="h4">Order summary</h2>
          {cart.map((product) => {
            const unitPrice =
              Math.round(
                product.price *
                  (1 - (product.discountPercentage || 0) / 100) *
                  100,
              ) / 100;
            const quantity = product.quantity || 1;

            return (
              <div className="checkout-item" key={product.id}>
                <span>
                  {product.title} × {quantity}
                </span>
                <span>{formatPrice(unitPrice * quantity)}</span>
              </div>
            );
          })}
          <div className="checkout-price-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <p className="checkout-total">
            Total: <strong>{formatPrice(cartTotal)}</strong>
          </p>
          <Link className="checkout-back-link" to="/cart">
            Back to cart
          </Link>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
