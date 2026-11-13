import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import useAuth from "../hooks/useAuth";
import useProductStoreContext from "../hooks/useProductStoreContext";
import ProductSearch from "./ProductSearch";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const { cart } = useProductStoreContext();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce(
    (count, item) => count + (item.quantity || 1),
    0,
  );

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
      <Link
        to="/cart"
        className="Nav-link Nav-cart"
        aria-label={`Cart, ${cartItemCount} ${cartItemCount === 1 ? "item" : "items"}`}
      >
        <svg
          aria-hidden="true"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 7H6" />
          <circle cx="10" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>
        Cart
        <span className="Nav-cart-count" aria-hidden="true">
          {cartItemCount}
        </span>
      </Link>
      <Link to="/wishlist" className="Nav-link Nav-wishlist">
        WishList
      </Link>
      <Link to="/admin" className="Nav-link">
        Admin
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
