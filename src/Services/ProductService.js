import axios from "axios";

async function getProducts(signal) {
  let data;

  try {
    const response = await axios.get(
      "https://dummyjson.com/products?limit=0",
      { signal },
    );
    data = response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      throw new Error(`Could not load products (${err.response.status})`);
    }

    throw err;
  }

  if (!Array.isArray(data.products)) {
    throw new Error("The products response was invalid");
  }

  return data.products;
}

export default getProducts;
