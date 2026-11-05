import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("q")?.toString().trim() || "";
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <header className="Navbar">
      <Link to="/" className="Nav-link Nav-home">
        Home
      </Link>
      <Link to="/products" className="Nav-link">
        Products
      </Link>
      <form
        className="Nav-search"
        role="search"
        onSubmit={handleSearch}
        key={searchParams.get("q") || ""}
      >
        <input
          aria-label="Search products"
          name="q"
          type="search"
          placeholder="Search products..."
          defaultValue={searchParams.get("q") || ""}
        />
        <button type="submit" aria-label="Submit product search">
          Search
        </button>
      </form>
      <Link to="/cart" className="Nav-link Nav-cart">
        Cart
      </Link>
      <Link to="/wishlist" className="Nav-link Nav-wishlist">
        WishList
      </Link>
      {isLoggedIn && (
        <button className="Nav-link Nav-logout" type="button" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Navbar;
