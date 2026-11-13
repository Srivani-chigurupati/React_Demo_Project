import React from "react";
import ProductGrid from "../components/ProductGrid";
import ProductFilters from "../components/ProductFilters";
import useProductStoreContext from "../hooks/useProductStoreContext";

const Products = () => {
  const {
    products,
    cart,
    wishlist,
    loading,
    error,
    toggleWishlist,
    addToCart,
    removeFromCart,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useProductStoreContext();

  return (
    <main className="container py-4 products-page">
      <div className="products-page-content">
        {loading && <p className="alert alert-info">Loading products...</p>}
        {error && (
          <p className="alert alert-danger" role="alert">
            {error}
          </p>
        )}
        <ProductFilters products={products} showResults={!loading && !error}>
          {({ filteredProducts, activeSearchTerm }) =>
            !loading &&
            !error && (
              <>
                {filteredProducts.length === 0 && (
                  <p className="alert alert-secondary">
                    No products found
                    {activeSearchTerm
                      ? " matching your search"
                      : " with the selected filters"}
                    .
                  </p>
                )}
                <ProductGrid
                  products={filteredProducts}
                  cart={cart}
                  wishlist={wishlist}
                  onToggleWishlist={toggleWishlist}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onIncrementCartQuantity={incrementCartQuantity}
                  onDecrementCartQuantity={decrementCartQuantity}
                />
              </>
            )
          }
        </ProductFilters>
      </div>
    </main>
  );
};

export default Products;
