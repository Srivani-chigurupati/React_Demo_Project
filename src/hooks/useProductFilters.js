import { useSearchParams } from "react-router-dom";

const getSearchTokens = (value) => value.toLowerCase().match(/[a-z0-9]+/g) || [];

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

export const formatCategoryName = (category) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const useProductFilters = (products) => {
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

  return {
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
  };
};

export default useProductFilters;
