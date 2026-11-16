import { Link, useParams } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import useProductStoreContext from "../../catalog/hooks/useProductStoreContext";
import "./OrderPlaced.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const OrderPlaced = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { orders, ordersError } = useProductStoreContext();
  const order = orders.find(
    (savedOrder) => savedOrder.id === orderId && savedOrder.userId === user?.id,
  );

  if (!order) {
    return (
      <main className="container order-placed-page py-4">
        <h1 className="mb-3">Order confirmation unavailable</h1>
        {ordersError ? (
          <p className="alert alert-danger" role="alert">
            {ordersError}
          </p>
        ) : (
          <p className="alert alert-secondary" role="status">
            This order could not be found for your account.
          </p>
        )}
        <Link className="btn btn-outline-primary" to="/products">
          Continue shopping
        </Link>
      </main>
    );
  }

  const address = order.shippingAddress;

  return (
    <main className="container order-placed-page py-4">
      <section className="order-placed-confirmation card p-4">
        <p className="order-placed-success-mark" aria-hidden="true">
          ✓
        </p>
        <h1>Order placed</h1>
        <p>
          Thank you, {order.customer.name}. Your order has been saved.
        </p>
        <p className="order-placed-id">
          Order number: <strong>{order.id}</strong>
        </p>
        <h2 className="h5 mt-4">Order summary</h2>
        {order.items.map((item) => (
          <div className="order-placed-item" key={item.productId}>
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>{formatPrice(item.lineTotal)}</span>
          </div>
        ))}
        <p className="order-placed-total">
          Total: <strong>{formatPrice(order.total)}</strong>
        </p>
        <p>
          Delivering to:{" "}
          <strong>
            {address.address}, {address.city}, {address.state}{" "}
            {address.postalCode}, {address.country}
          </strong>
        </p>
        <p className="order-placed-note">
          Payment method: {order.paymentMethod}
        </p>
        <Link className="btn btn-primary mt-3" to="/products">
          Continue shopping
        </Link>
      </section>
    </main>
  );
};

export default OrderPlaced;
