async function getProducts(signal) {
  const response = await fetch("https://dummyjson.com/products", { signal });
  if (!response.ok) {
    throw new Error(`Could not load products (${response.status})`);
  }
  const data = await response.json();
  return data.products;
}

export default getProducts;
