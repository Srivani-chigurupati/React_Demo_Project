import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import "./Home.css";

const formatCategoryName = (category) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const Home = () => {
  const {
    products,
    cart,
    wishlist,
    loading,
    error,
    toggleWishlist,
    addToCart,
  } = useOutletContext();

  //   const categoryMap = {};

  // products.forEach((product) => {
  //   const category = product.category;

  //   if (!categoryMap[category]) {
  //     categoryMap[category] = {
  //       name: category,
  //       count: 0,
  //       image: product.images[0],
  //     };
  //   }

  //   categoryMap[category].count += 1;
  // });

  // const categories = Object.values(categoryMap).sort((first, second) =>
  //   first.name.localeCompare(second.name),
  // );

  const categories = Object.values(
    products.reduce((categoryMap, product) => {
      if (!categoryMap[product.category]) {
        categoryMap[product.category] = {
          name: product.category,
          count: 0,
          image: product.images[0],
        };
      }

      categoryMap[product.category].count += 1;
      return categoryMap;
    }, {}),
  ).sort((first, second) => first.name.localeCompare(second.name));

  const featuredProducts = [...products]
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 4);

  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-eyebrow">Everyday finds, all in one place</p>
        <h1>Find something you'll love.</h1>
        <p className="home-intro">
          Browse the latest picks across beauty, fashion, tech, home, and more.
        </p>
        <Link className="home-shop-button" to="/products">
          Explore all products
        </Link>
      </section>

      <section className="home-section" aria-labelledby="categories-heading">
        <div className="home-section-heading">
          <div>
            <p className="home-eyebrow">Explore the catalog</p>
            <h2 id="categories-heading">Shop by category</h2>
          </div>
        </div>
        {loading && <p className="home-message">Loading categories...</p>}
        {error && (
          <p className="home-message home-error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && (
          <div className="home-category-grid">
            {categories.map((category) => (
              <Link
                className="home-category-card"
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
              >
                <img src={category.image} alt="" loading="lazy" />
                <span className="home-category-overlay">
                  <span className="home-category-name">
                    {formatCategoryName(category.name)}
                  </span>
                  <span className="home-category-count">
                    {category.count} {category.count === 1 ? "item" : "items"}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section
        className="home-section home-featured"
        aria-labelledby="featured-heading"
      >
        <div className="home-section-heading home-section-heading-row">
          <div>
            <p className="home-eyebrow">Customer favorites</p>
            <h2 id="featured-heading">Top rated</h2>
          </div>
          <Link className="home-view-all" to="/products">
            View all products <span aria-hidden="true">→</span>
          </Link>
        </div>
        {loading && <p className="home-message">Loading products...</p>}
        {error && (
          <p className="home-message home-error" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && featuredProducts.length > 0 && (
          <ProductGrid
            products={featuredProducts}
            cart={cart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}
      </section>

    </main>
  );
};

export default Home;
