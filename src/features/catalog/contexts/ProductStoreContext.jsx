import { createContext, useContext } from "react";
import { useProductStore } from "../hooks/useProductStore";
import Toaster from "../../../shared/components/Toaster";

const ProductStoreContext = createContext(undefined);

export const useProductStoreContext = () => {
  const productStore = useContext(ProductStoreContext);

  if (!productStore) {
    throw new Error(
      "useProductStoreContext must be used within a ProductStoreProvider.",
    );
  }

  return productStore;
};

export const ProductStoreProvider = ({ children }) => {
  const productStore = useProductStore();

  return (
    <ProductStoreContext.Provider value={productStore}>
      <Toaster message={productStore.toastMessage} />
      {children}
    </ProductStoreContext.Provider>
  );
};

export default ProductStoreContext;
