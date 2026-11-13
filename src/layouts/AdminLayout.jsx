import { NavLink, Outlet } from "react-router-dom";
import useProductStoreContext from "../hooks/useProductStoreContext";

const adminLinks = [
  { to: "/admin/products/add", label: "Add product" },
  { to: "/admin/products/update", label: "Update product" },
  { to: "/admin/products/delete", label: "Delete product" },
];

const Admin = () => {
  const { error } = useProductStoreContext();

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1 className="mb-2">Admin panel</h1>
        <p className="text-secondary mb-0">Manage your product catalog.</p>
      </header>
      <nav className="nav nav-tabs mb-4" aria-label="Admin navigation">
        {adminLinks.map(({ to, label, end }) => (
          <NavLink
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            end={end}
            key={to}
            to={to}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      {error && (
        <p className="alert alert-danger" role="alert">
          Products could not be loaded: {error}
        </p>
      )}
      <Outlet />
    </main>
  );
};

export default Admin;
