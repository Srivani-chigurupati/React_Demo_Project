import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import "../components/ProductButton.css";
import "../components/WishlistButton.css";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const {
    products,
    loading,
    error,
    addToCart,
    wishlist,
    toggleWishlist,
    cart,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useOutletContext();
  const product = products.find((item) => item.id === Number(id));

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const discountAmount = price * (discountPercentage / 100);
    return price - discountAmount;
  };

  if (loading) {
    return <p>Loading product...</p>;
  }
  if (error) return <p role="alert">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const cartItem = cart.find((item) => item.id === product.id);

  return (
    <div className="product-details-container">
      <div className="product-card">
        <img
          className="product-image"
          src={product.images[0]}
          alt={product.title}
        />
        <div className="product-info">
          <h2 className="product-title">{product.title}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-brand">Brand: {product.brand}</p>
          <p className="product-price">Price: ${product.price.toFixed(2)}</p>
          <p className="discount-price">
            Discount price: $
            {calculateDiscountedPrice(
              product.price,
              product.discountPercentage,
            ).toFixed(2)}
          </p>
          <p className="product-rating">⭐ {product.rating}</p>
          <div className="product-actions">
            <button
              className="product-button"
              type="button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            {cartItem && (
              <div className="quantity-control" aria-label="Quantity">
                <button
                  className="quantity-button"
                  type="button"
                  aria-label={`Decrease ${product.title} quantity`}
                  onClick={() => decrementCartQuantity(product)}
                >
                  −
                </button>
                <span aria-live="polite">{cartItem.quantity || 1}</span>
                <button
                  className="quantity-button"
                  type="button"
                  aria-label={`Increase ${product.title} quantity`}
                  onClick={() => incrementCartQuantity(product)}
                >
                  +
                </button>
              </div>
            )}
          </div>
          <button
            className={`wishlist-icon ${
              isWishlisted ? "is-wishlisted" : ""
            }`}
            type="button"
            aria-label={
              isWishlisted
                ? `Remove ${product.title} from wishlist`
                : `Add ${product.title} to wishlist`
            }
            aria-pressed={isWishlisted}
            onClick={() => toggleWishlist(product)}
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>
      </div>
      <Link className="back-button" to="/products">
        Back to products
      </Link>
    </div>
  );
};

export default ProductDetails;
