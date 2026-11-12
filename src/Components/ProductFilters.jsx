import { useSearchParams } from "react-router-dom";

const getSearchTokens = (value) =>
  value.toLowerCase().match(/[a-z0-9]+/g) || [];

const matchesSearch = (product, queryTokens) => {
  if (queryTokens.length === 0) {
    return true;
  }

  const productTokens = [product.title, product.brand, product.category]
    .filter(Boolean)
    .flatMap(getSearchTokens);

  return queryTokens.every((queryToken) =>
    productTokens.some((productToken) => productToken.startsWith(queryToken)),
  );
};

const getDiscountedPrice = (product) =>
  product.price * (1 - product.discountPercentage / 100);

const formatCategoryName = (category) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const ProductFilters = ({ products, showResults, children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";
  const searchTerm = searchParams.get("q")?.trim().toLowerCase() || "";
  const activeSearchTerm = searchTerm.length >= 3 ? searchTerm : "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const minRatingParam = searchParams.get("minRating") || "";
  const sortBy = searchParams.get("sort") || "featured";
  const searchTokens = getSearchTokens(activeSearchTerm);

  const categories = [...new Set(products.map((product) => product.category))]
    .filter(Boolean)
    .sort((first, second) => first.localeCompare(second));
  const minPrice = Number(minPriceParam);
  const maxPrice = Number(maxPriceParam);
  const minimumRating = Number(minRatingParam);

  const filteredProducts = products
    .filter((product) => {
      const price = getDiscountedPrice(product);
      return (
        (!selectedCategory || product.category === selectedCategory) &&
        matchesSearch(product, searchTokens) &&
        (!minPriceParam || (Number.isFinite(minPrice) && price >= minPrice)) &&
        (!maxPriceParam || (Number.isFinite(maxPrice) && price <= maxPrice)) &&
        (!minRatingParam ||
          (Number.isFinite(minimumRating) && product.rating >= minimumRating))
      );
    })
    .sort((first, second) => {
      switch (sortBy) {
        case "price-asc":
          return getDiscountedPrice(first) - getDiscountedPrice(second);
        case "price-desc":
          return getDiscountedPrice(second) - getDiscountedPrice(first);
        case "rating":
          return second.rating - first.rating;
        case "name":
          return first.title.localeCompare(second.title);
        default:
          return 0;
      }
    });

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    setSearchParams(nextParams, { replace: true });
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    ["category", "minPrice", "maxPrice", "minRating", "sort"].forEach((key) =>
      nextParams.delete(key),
    );
    setSearchParams(nextParams, { replace: true });
  };

  const heading = activeSearchTerm
    ? `Search results for "${searchParams.get("q").trim()}"`
    : selectedCategory
      ? formatCategoryName(selectedCategory)
      : "All Products";

  return (
    <>
      <h1 className="mb-4">{heading}</h1>
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
              onChange={(event) => updateFilter("category", event.target.value)}
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
              onChange={(event) => updateFilter("minPrice", event.target.value)}
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
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
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
