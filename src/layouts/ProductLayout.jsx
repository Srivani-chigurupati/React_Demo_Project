import React from "react";
import { Outlet } from "react-router-dom";
import Toaster from "../components/Toaster";
import useProductStore from "../hooks/useProductStore";

const ProductLayout = () => {
  const {
    products,
    wishlist,
    cart,
    loading,
    error,
    toastMessage,
    toggleWishlist,
    addToCart,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  return (
    <>
      <Toaster message={toastMessage} />
      <Outlet
        context={{
          products,
          wishlist,
          cart,
          loading,
          error,
          toggleWishlist,
          addToCart,
          removeFromCart,
          incrementCartQuantity,
          decrementCartQuantity,
          addProduct,
          updateProduct,
          deleteProduct,
        }}
      />
    </>
  );
};

export default ProductLayout;
