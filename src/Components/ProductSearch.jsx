import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const ProductSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const searchTimeout = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(searchTimeout.current);
    },
    [],
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    const query = value.trim();
    setSearchTerm(value);
    clearTimeout(searchTimeout.current);

    const isProductsPage = location.pathname === "/products";

    if (query.length < 3 && !isProductsPage) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    if (query.length >= 3) {
      nextParams.set("q", query);
    } else {
      nextParams.delete("q");
    }

    const nextSearch = nextParams.toString();
    if (isProductsPage && nextSearch === location.search.slice(1)) {
      return;
    }

    searchTimeout.current = setTimeout(() => {
      navigate(
        {
          pathname: "/products",
          search: nextSearch ? `?${nextSearch}` : "",
        },
        { replace: true },
      );
    }, 250);
  };

  return (
    <form
      className="Nav-search"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        className="form-control"
        aria-label="Search products"
        name="q"
        type="search"
        placeholder="Search products ...."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </form>
  );
};

export default ProductSearch;
