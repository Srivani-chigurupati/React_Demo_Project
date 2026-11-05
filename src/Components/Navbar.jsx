import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const searchTimeout = useRef(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

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
    <header className="Navbar">
      <Link to="/" className="Nav-link Nav-home">
        Home
      </Link>
      <Link to="/products" className="Nav-link">
        Products
      </Link>
      <form className="Nav-search" role="search" onSubmit={handleSearchSubmit}>
        <input
          aria-label="Search products"
          name="q"
          type="search"
          placeholder="Search products ...."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </form>
      <Link to="/cart" className="Nav-link Nav-cart">
        Cart
      </Link>
      <Link to="/wishlist" className="Nav-link Nav-wishlist">
        WishList
      </Link>
      {isLoggedIn && (
        <button
          className="Nav-link Nav-logout"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Navbar;
