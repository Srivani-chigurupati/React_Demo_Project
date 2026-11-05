import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./Components/Navbar";
import NotFound from "./Components/NotFound";
import About from "./Pages/About";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Home from "./Pages/Home";
import ProductDetails from "./Pages/ProductDetails";
import Products from "./Pages/Products";
import Wishlist from "./Pages/Wishlist";
import ProductLayout from "./SharedLayouts/ProductLayout";
import Login from "./Components/Login";
import ProtectedRoutes from "./SharedLayouts/ProtectedRoutes";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          element: <ProductLayout />,
          children: [
            {
              path: "products",
              element: <Products />,
            },
            {
              path: "product-details/:id",
              element: <ProductDetails />,
            },
            { path: "cart", element: <Cart /> },
            { path: "checkout", element: <Checkout /> },
            {
              path: "wishlist",
              element: <Wishlist />,
            },
          ],
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
    { path: "/login", element: <Login /> },
  ]);
  return <RouterProvider router={routes}></RouterProvider>;
}

export default App;
