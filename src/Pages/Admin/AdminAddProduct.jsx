import { useNavigate, useOutletContext } from "react-router-dom";
import AdminProductForm from "../../components/Admin/AdminProductForm";

const AdminAddProduct = () => {
  const { addProduct, loading } = useOutletContext();
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
