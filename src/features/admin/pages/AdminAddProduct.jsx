import { useNavigate } from "react-router-dom";
import AdminProductForm from "../components/AdminProductForm";
import useProductStoreContext from "../../catalog/hooks/useProductStoreContext";

const AdminAddProduct = () => {
  const { addProduct, loading } = useProductStoreContext();
  const navigate = useNavigate();

  return (
    <AdminProductForm
      loading={loading}
      submitLabel="Add product"
      onSubmit={(product) => {
        addProduct(product);
        navigate("/admin");
      }}
    />
  );
};

export default AdminAddProduct;
