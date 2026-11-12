import useProductSearch from "../hooks/useProductSearch";

const ProductSearch = () => {
  const { handleSearchChange, searchTerm } = useProductSearch();

  return (
    <form
      className="Nav-search"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <input
        className="form-control"
        aria-label="Search products"
        name="q"
        type="search"
        placeholder="Search products ...."
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </form>
  );
};

export default ProductSearch;
