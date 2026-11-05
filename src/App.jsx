import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./Pages/Home";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Wishlist from "./pages/Wishlist";
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
          path: "about",
          element: <About />,
        },
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
