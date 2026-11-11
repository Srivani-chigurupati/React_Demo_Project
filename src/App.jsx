import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotFound from "./Pages/NotFound";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ProductDetails from "./Pages/ProductDetails";
import Products from "./Pages/Products";
import Wishlist from "./Pages/Wishlist";
import ProductLayout from "./layouts/ProductLayout";
import ProtectedRoutes from "./layouts/ProtectedRoutes";

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
    </div>
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
          element: <ProductLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },
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
