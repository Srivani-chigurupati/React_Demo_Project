import { useContext } from "react";
import ProductStoreContext from "../contexts/ProductStoreContext";

const useProductStoreContext = () => {
  const productStore = useContext(ProductStoreContext);

  if (!productStore) {
    throw new Error(
      "useProductStoreContext must be used within a ProductStoreProvider.",
    );
  }

  return productStore;
};

export default useProductStoreContext;
