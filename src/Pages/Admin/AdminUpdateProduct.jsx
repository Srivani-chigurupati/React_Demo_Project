import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AdminProductForm from "../../components/Admin/AdminProductForm";
import AdminProductList from "../../components/Admin/AdminProductList";

const AdminUpdateProduct = () => {
  const { products, loading, updateProduct } = useOutletContext();
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
