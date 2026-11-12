import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AdminProductList from "../../components/Admin/AdminProductList";

const AdminDeleteProduct = () => {
  const { products, loading, deleteProduct } = useOutletContext();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <>
      {error && (
        <p className="alert alert-danger" role="alert">
          {error}
        </p>
      )}
      <AdminProductList
        products={products}
        loading={loading}
        actionLabel="Delete"
        onAction={(product) => {
          if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) {
            return;
          }
          try {
            deleteProduct(product.id);
            setError("");
            navigate("/admin");
          } catch (err) {
            setError(
              err instanceof Error ? err.message : "Could not delete this product.",
            );
          }
        }}
      />
    </>
  );
};

export default AdminDeleteProduct;
