import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useAuth";
import "./AccountMenu.css";

const AccountMenu = () => {
  const { user, setUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const initials = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setUser(null);
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  const handleImageError = (event) => {
    event.currentTarget.hidden = true;
  };

  return (
    <div className="Nav-account" ref={menuRef}>
      <button
        ref={toggleRef}
        className="Nav-link Nav-account-toggle"
        type="button"
        aria-expanded={isOpen}
        aria-controls="nav-account-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="Nav-account-avatar" aria-hidden="true">
          {isLoggedIn && user?.image && (
            <img src={user.image} alt="" onError={handleImageError} />
          )}
          {isLoggedIn ? initials || "U" : "?"}
        </span>
        <span className="Nav-account-label">
          <span>
            {isLoggedIn
              ? `Hello, ${user?.firstName || "there"}`
              : "Hello, sign in"}
          </span>
          <strong>Account &amp; Lists</strong>
        </span>
        <span className="Nav-account-chevron" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <section
          className="Nav-account-menu"
          id="nav-account-menu"
          aria-label="Account and lists"
        >
          {isLoggedIn ? (
            <>
              <header className="Nav-account-profile">
                <span
                  className="Nav-account-avatar Nav-account-avatar-large"
                  aria-hidden="true"
                >
                  {user?.image && (
                    <img src={user.image} alt="" onError={handleImageError} />
                  )}
                  {initials || "U"}
                </span>
                <div>
                  <h2>{fullName || "Your account"}</h2>
                  <p>Signed in</p>
                </div>
              </header>
              <div className="Nav-account-sections">
                <section>
                  <h3>Account information</h3>
                  <p>{fullName || "Name not provided"}</p>
                  <p>
                    {user?.username ? `@${user.username}` : "Customer account"}
                  </p>
                </section>
                <section>
                  <h3>Contact information</h3>
                  <p>{user?.email || "No email available"}</p>
                  <p>{user?.phone || "No phone number available"}</p>
                </section>
                <section>
                  <h3>Your lists &amp; orders</h3>
                  <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                    Your wishlist
                  </Link>
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    Admin panel
                  </Link>
                  <p className="Nav-account-orders">
                    Order history is not available yet
                  </p>
                </section>
              </div>
              <footer className="Nav-account-footer">
                <button type="button" onClick={handleLogout}>
                  Sign out
                </button>
              </footer>
            </>
          ) : (
            <div className="Nav-account-signed-out">
              <p>Sign in to view your account, contact details, and lists.</p>
              <Link
                className="Nav-signin-button"
                to="/login"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AccountMenu;
