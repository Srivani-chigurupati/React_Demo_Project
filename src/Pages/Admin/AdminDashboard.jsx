import { Link, useOutletContext } from "react-router-dom";

const AdminDashboard = () => {
  const { products, loading } = useOutletContext();

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <h2 className="h4">Product management</h2>
        {loading ? (
          <p className="text-secondary">Loading product catalog...</p>
        ) : (
          <p className="text-secondary">
            There {products.length === 1 ? "is" : "are"} {products.length}{" "}
            {products.length === 1 ? "product" : "products"} in your catalog.
          </p>
        )}
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-primary" to="/admin/products/add">
            Add product
          </Link>
          <Link className="btn btn-outline-primary" to="/admin/products/update">
            Update product
          </Link>
          <Link className="btn btn-outline-danger" to="/admin/products/delete">
            Delete product
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
