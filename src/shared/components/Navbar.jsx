import { Link } from "react-router-dom";
import "./Navbar.css";
import useProductStoreContext from "../../features/catalog/hooks/useProductStoreContext";
import ProductSearch from "../../features/catalog/components/ProductSearch";
import AccountMenu from "./AccountMenu";

const Navbar = () => {
  const { cart } = useProductStoreContext();
  const cartItemCount = cart.reduce(
    (count, item) => count + (item.quantity || 1),
    0,
  );

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
      <AccountMenu />
    </header>
  );
};

export default Navbar;
