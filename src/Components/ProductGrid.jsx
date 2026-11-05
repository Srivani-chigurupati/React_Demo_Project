import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductButton.css";
import "./ProductGrid.css";
import "./WishlistButton.css";

const ProductGrid = ({
  products,
  wishlist = [],
  cart = [],
  onToggleWishlist,
  onAddToCart,
  onRemoveFromCart,
  onIncrementCartQuantity,
  onDecrementCartQuantity,
}) => {
  const navigate = useNavigate();

  const calculateDiscountedPrice = (price, discountPercentage) =>
    price - price * (discountPercentage / 100);

  return (
    <div className="products-container">
      {products.map((product) => {
        const isWishlisted = wishlist.some((item) => item.id === product.id);
        const cartItem = cart.find((item) => item.id === product.id);
        const isInCart = Boolean(cartItem);
        const quantity = cartItem?.quantity || 1;

        return (
          <div className="product-card" key={product.id}>
            {onToggleWishlist && (
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
                onClick={() => onToggleWishlist(product)}
              >
                {isWishlisted ? "♥" : "♡"}
              </button>
            )}
            <img
              className="product-image"
              src={product.images[0]}
              alt={product.title}
            />
            <h2 className="product-title">{product.title}</h2>
            <p className="product-price">
              Price : $
              {calculateDiscountedPrice(
                product.price,
                product.discountPercentage,
              ).toFixed(2)}
            </p>
            <p className="product-rating">⭐{product.rating}</p>
            <button
              className="product-button"
              type="button"
              onClick={() => navigate(`/product-details/${product.id}`)}
            >
              View Details
            </button>
            {(onAddToCart || onRemoveFromCart) && (
              <div className="product-actions">
                <button
                  className="product-button"
                  type="button"
                  onClick={() =>
                    onAddToCart
                      ? isInCart
                        ? onRemoveFromCart?.(product)
                        : onAddToCart(product)
                      : onRemoveFromCart?.(product)
                  }
                >
                  {isInCart ? "Remove from Cart" : "Add to Cart"}
                </button>
                {isInCart &&
                  onIncrementCartQuantity &&
                  onDecrementCartQuantity && (
                    <div className="quantity-control" aria-label="Quantity">
                      <button
                        className="quantity-button"
                        type="button"
                        aria-label={`Decrease ${product.title} quantity`}
                        onClick={() => onDecrementCartQuantity(product)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        className="quantity-button"
                        type="button"
                        aria-label={`Increase ${product.title} quantity`}
                        onClick={() => onIncrementCartQuantity(product)}
                      >
                        +
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
