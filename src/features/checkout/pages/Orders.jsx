import { Link } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import useProductStoreContext from "../../catalog/hooks/useProductStoreContext";
import "./Orders.css";

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const Orders = () => {
  const { user } = useAuth();
  const { orders, ordersError } = useProductStoreContext();
  const userOrders = orders
    .filter((order) => order.userId === user?.id)
    .sort((first, second) => Date.parse(second.placedAt) - Date.parse(first.placedAt));

  return (
    <main className="container orders-page py-4">
      <h1 className="mb-4">Your orders</h1>
      {ordersError ? (
        <p className="alert alert-danger" role="alert">
          Your orders could not be loaded: {ordersError}
        </p>
      ) : userOrders.length === 0 ? (
        <section className="orders-empty card p-4">
          <h2 className="h4">No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link className="btn btn-primary align-self-start" to="/products">
            Browse products
          </Link>
        </section>
      ) : (
        <div className="orders-list">
          {userOrders.map((order) => (
            <article className="orders-card card" key={order.id}>
              <header className="orders-card-header">
                <div>
                  <span className="orders-meta-label">Order placed</span>
                  <span>{formatDate(order.placedAt)}</span>
                </div>
                <div>
                  <span className="orders-meta-label">Total</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
                <div>
                  <span className="orders-meta-label">Order number</span>
                  <span className="orders-id">{order.id}</span>
                </div>
                <span className="orders-status">{order.status}</span>
              </header>
              <div className="orders-card-body">
                <div className="orders-items">
                  {order.items.map((item) => (
                    <div className="orders-item" key={item.productId}>
                      {item.image && (
                        <img src={item.image} alt="" loading="lazy" />
                      )}
                      <div>
                        <p className="orders-item-title">{item.title}</p>
                        <p>
                          Quantity: {item.quantity} ·{" "}
                          {formatPrice(item.unitPrice)} each
                        </p>
                      </div>
                      <strong>{formatPrice(item.lineTotal)}</strong>
                    </div>
                  ))}
                </div>
                <Link
                  className="btn btn-outline-primary orders-details-link"
                  to={`/order-placed/${encodeURIComponent(order.id)}`}
                >
                  View order details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Orders;
