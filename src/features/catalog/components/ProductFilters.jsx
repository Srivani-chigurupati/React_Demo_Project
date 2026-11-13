import { useState } from "react";
import useProductFilters, {
  formatCategoryName,
} from "../hooks/useProductFilters";

const ProductFilters = ({ products, showResults, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filters = useProductFilters(products);
  const {
    activeSearchTerm,
    categories,
    clearFilters,
    filteredProducts,
    heading,
    maxPriceParam,
    minPriceParam,
    minRatingParam,
    selectedCategory,
    sortBy,
    updateFilter,
  } = filters;

  return (
    <>
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <h1 className="mb-0">{heading}</h1>
        <button
          className="btn btn-outline-secondary d-inline-flex align-items-center flex-shrink-0"
          type="button"
          aria-label={
            isExpanded ? "Hide product filters" : "Show product filters"
          }
          aria-expanded={isExpanded}
          aria-controls="product-filter-controls"
          title={isExpanded ? "Hide filters" : "Show filters"}
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16l-6.5 7.5v5l-3 1.5v-6.5L4 5z" />
          </svg>
        </button>
      </div>
      <div id="product-filter-controls" hidden={!isExpanded}>
        <section
          className="card card-body bg-body-tertiary mb-4"
          aria-label="Product filters"
        >
          <div className="row g-3 align-items-end">
            <div className="col-12 col-sm-6 col-lg-3">
              <label className="form-label" htmlFor="filter-category">
                Category
              </label>
              <select
                className="form-select"
                id="filter-category"
                value={selectedCategory}
                onChange={(event) =>
                  updateFilter("category", event.target.value)
                }
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-6 col-sm-3 col-lg-2">
              <label className="form-label" htmlFor="filter-min-price">
                Min price
              </label>
              <input
                className="form-control"
                id="filter-min-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="No minimum"
                value={minPriceParam}
                onChange={(event) =>
                  updateFilter("minPrice", event.target.value)
                }
              />
            </div>
            <div className="col-6 col-sm-3 col-lg-2">
              <label className="form-label" htmlFor="filter-max-price">
                Max price
              </label>
              <input
                className="form-control"
                id="filter-max-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="No maximum"
                value={maxPriceParam}
                onChange={(event) =>
                  updateFilter("maxPrice", event.target.value)
                }
              />
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label" htmlFor="filter-rating">
                Minimum rating
              </label>
              <select
                className="form-select"
                id="filter-rating"
                value={minRatingParam}
                onChange={(event) =>
                  updateFilter("minRating", event.target.value)
                }
              >
                <option value="">Any rating</option>
                <option value="4">4 stars and up</option>
                <option value="3">3 stars and up</option>
                <option value="2">2 stars and up</option>
              </select>
            </div>
            <div className="col-12 col-sm-6 col-lg-2">
              <label className="form-label" htmlFor="filter-sort">
                Sort by
              </label>
              <select
                className="form-select"
                id="filter-sort"
                value={sortBy}
                onChange={(event) => updateFilter("sort", event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="rating">Top rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
            <div className="col-12 col-lg-1 d-grid">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={clearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </section>
      </div>
      {showResults && (
        <p className="text-secondary small mb-3" aria-live="polite">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      )}
      {children({ filteredProducts, activeSearchTerm })}
    </>
  );
};

export default ProductFilters;
