import React from "react";
import { Link } from "react-router-dom";
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
          <div className="product-card card h-100" key={product.id}>
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
            <Link
              className="product-card-link"
              to={`/product-details/${product.id}`}
              aria-label={`View details for ${product.title}`}
            >
              <img
                className="product-image card-img-top"
                src={product.images[0]}
                alt=""
              />
              <div className="card-body product-card-info">
                <h2 className="product-title card-title">{product.title}</h2>
                <p className="product-price">
                  $
                  {calculateDiscountedPrice(
                    product.price,
                    product.discountPercentage,
                  ).toFixed(2)}
                </p>
                <p className="product-rating mb-3">⭐ {product.rating}</p>
              </div>
            </Link>
            <div className="card-body product-card-actions-container">
              <div className="product-card-actions">
                <div className="product-action-row">
                  {(onAddToCart || onRemoveFromCart) && (
                    <button
                      className="product-button btn btn-primary"
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
                  )}
                </div>
                <div className="product-action-row">
                  {isInCart &&
                  onIncrementCartQuantity &&
                  onDecrementCartQuantity ? (
                    <div className="quantity-control" aria-label="Quantity">
                      <button
                        className="quantity-button btn btn-outline-secondary btn-sm"
                        type="button"
                        aria-label={`Decrease ${product.title} quantity`}
                        onClick={() => onDecrementCartQuantity(product)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        className="quantity-button btn btn-outline-secondary btn-sm"
                        type="button"
                        aria-label={`Increase ${product.title} quantity`}
                        onClick={() => onIncrementCartQuantity(product)}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div
                      className="quantity-control-placeholder"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
