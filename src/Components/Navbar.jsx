import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../SharedLayouts/AuthContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="Navbar">
      <Link to="/" className="Nav-link">
        Home
      </Link>
      <Link to="/about" className="Nav-link">
        About
      </Link>
      <Link to="/products" className="Nav-link">
        Products
      </Link>
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
    </div>
  );
};

export default Navbar;
