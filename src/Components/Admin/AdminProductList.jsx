import { useMemo, useState } from "react";

const AdminProductList = ({
  products,
  loading,
  actionLabel,
  onAction,
}) => {
  const [search, setSearch] = useState("");
  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) =>
      [product.title, product.category, product.brand]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [products, search]);
  const searchId = `admin-${actionLabel.toLowerCase()}-search`;

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap align-items-baseline justify-content-between gap-2 mb-3">
          <h2 className="h4 mb-0">Product catalog</h2>
          <span className="text-secondary">
            {visibleProducts.length} of {products.length} products
          </span>
        </div>
        <div className="mb-3">
          <label className="visually-hidden" htmlFor={searchId}>
            Search products by name, category, or brand
          </label>
          <input
            className="form-control"
            id={searchId}
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        {loading ? (
          <p className="alert alert-info mb-0">Loading products...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">
                    <span className="visually-hidden">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product.images?.[0] || product.thumbnail}
                          alt=""
                          width="52"
                          height="52"
                          className="rounded border object-fit-contain"
                        />
                        <span className="fw-semibold">{product.title}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>${Number(product.price).toFixed(2)}</td>
                    <td>{product.stock ?? 0}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          actionLabel === "Delete"
                            ? "btn-outline-danger"
                            : "btn-outline-primary"
                        }`}
                        type="button"
                        onClick={() => onAction(product)}
                        aria-label={`${actionLabel} ${product.title}`}
                      >
                        {actionLabel}
                      </button>
                    </td>
                  </tr>
                ))}
                {visibleProducts.length === 0 && (
                  <tr>
                    <td className="text-center text-secondary py-4" colSpan="5">
                      {products.length === 0
                        ? "No products in the catalog."
                        : "No products match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProductList;
