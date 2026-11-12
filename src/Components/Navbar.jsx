import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import useAuth from "../hooks/useAuth";
import ProductSearch from "./ProductSearch";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <header className="Navbar navbar navbar-expand bg-light border-bottom px-3 px-md-4 gap-2">
      <Link to="/" className="Nav-link Nav-home navbar-brand">
        Home
      </Link>
      <Link to="/products" className="Nav-link nav-link">
        Products
      </Link>
      <ProductSearch />
      <Link to="/cart" className="Nav-link Nav-cart">
        Cart
      </Link>
      <Link to="/wishlist" className="Nav-link Nav-wishlist">
        WishList
      </Link>
      {isLoggedIn && (
        <button
          className="Nav-link Nav-logout btn btn-outline-secondary btn-sm"
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
