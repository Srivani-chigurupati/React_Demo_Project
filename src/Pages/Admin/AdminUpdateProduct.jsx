import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminProductForm from "../../components/Admin/AdminProductForm";
import AdminProductList from "../../components/Admin/AdminProductList";
import useProductStoreContext from "../../hooks/useProductStoreContext";

const AdminUpdateProduct = () => {
  const { products, loading, updateProduct } = useProductStoreContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const currentProduct = selectedProduct
    ? products.find((product) => product.id === selectedProduct.id)
    : null;

  if (!currentProduct) {
    return (
      <AdminProductList
        products={products}
        loading={loading}
        actionLabel="Edit"
        onAction={setSelectedProduct}
        pagination
      />
    );
  }

  return (
    <AdminProductForm
      key={currentProduct.id}
      initialProduct={currentProduct}
      loading={loading}
      submitLabel="Save changes"
      onCancel={() => setSelectedProduct(null)}
      onSubmit={(productData) => {
        updateProduct(currentProduct.id, productData);
        navigate("/admin");
      }}
    />
  );
};

export default AdminUpdateProduct;
