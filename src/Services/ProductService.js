async function getProducts(signal) {
  const response = await fetch("https://dummyjson.com/products?limit=0", {
    signal,
  });
  if (!response.ok) {
    throw new Error(`Could not load products (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data.products)) {
    throw new Error("The products response was invalid");
  }

  return data.products;
}

export default getProducts;
