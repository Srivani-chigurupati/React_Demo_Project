import "./App.css";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import NotFound from "./Pages/NotFound";
import Checkout from "./Pages/Checkout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Products from "./Pages/Products";
import ProductLayout from "./layouts/ProductLayout";
import ProtectedRoutes from "./layouts/ProtectedRoutes";

const Cart = lazy(() => import("./Pages/Cart"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminAddProduct = lazy(() => import("./pages/Admin/AdminAddProduct"));
const AdminUpdateProduct = lazy(
  () => import("./pages/Admin/AdminUpdateProduct"),
);
const AdminDeleteProduct = lazy(
  () => import("./pages/Admin/AdminDeleteProduct"),
);

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
            {
              path: "admin",
              element: <AdminLayout />,
              children: [
                { index: true, element: <AdminDashboard /> },
                {
                  path: "products/add",
                  element: <AdminAddProduct />,
                },
                {
                  path: "products/update",
                  element: <AdminUpdateProduct />,
                },
                {
                  path: "products/delete",
                  element: <AdminDeleteProduct />,
                },
              ],
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
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center" role="status">
          Loading page...
        </div>
      }
    >
      <RouterProvider router={routes} />
    </Suspense>
  );
}

export default App;
