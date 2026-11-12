import { NavLink, Outlet, useOutletContext } from "react-router-dom";

const adminLinks = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/products/add", label: "Add product" },
  { to: "/admin/products/update", label: "Update product" },
  { to: "/admin/products/delete", label: "Delete product" },
];

const Admin = () => {
  const productContext = useOutletContext();

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1 className="mb-2">Admin panel</h1>
        <p className="text-secondary mb-0">Manage your product catalog.</p>
      </header>
      <nav className="nav nav-tabs mb-4" aria-label="Admin navigation">
        {adminLinks.map(({ to, label, end }) => (
          <NavLink
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            end={end}
            key={to}
            to={to}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      {productContext.error && (
        <p className="alert alert-danger" role="alert">
          Products could not be loaded: {productContext.error}
        </p>
      )}
      <Outlet context={productContext} />
    </main>
  );
};

export default Admin;
