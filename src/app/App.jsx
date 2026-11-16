import "./App.css";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Footer from "../shared/components/Footer";
import Navbar from "../shared/components/Navbar";
import NotFound from "./pages/NotFound";
import Checkout from "../features/checkout/pages/Checkout";
import Home from "../features/catalog/pages/Home";
import Login from "../features/auth/pages/Login";
import Products from "../features/catalog/pages/Products";
import ProductLayout from "./layouts/ProductLayout";
import { ProductStoreProvider } from "../features/catalog/contexts/ProductStoreContext";
import ProtectedRoutes from "../features/auth/ProtectedRoutes";

const Cart = lazy(() => import("../features/cart/pages/Cart"));
const OrderPlaced = lazy(
  () => import("../features/checkout/pages/OrderPlaced"),
);
const Orders = lazy(() => import("../features/checkout/pages/Orders"));
const ProductDetails = lazy(
  () => import("../features/catalog/pages/ProductDetails"),
);
const Wishlist = lazy(() => import("../features/wishlist/pages/Wishlist"));
const AdminLayout = lazy(() => import("../features/admin/AdminLayout"));
const AdminAddProduct = lazy(
  () => import("../features/admin/pages/AdminAddProduct"),
);
const AdminUpdateProduct = lazy(
  () => import("../features/admin/pages/AdminUpdateProduct"),
);
const AdminDeleteProduct = lazy(
  () => import("../features/admin/pages/AdminDeleteProduct"),
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
          <ProductStoreProvider>
            <Layout />
          </ProductStoreProvider>
        </ProtectedRoutes>
      ),
      children: [
        {
          element: <ProductLayout />,
          children: [
            { index: true, element: <Home /> },
            { path: "products", element: <Products /> },
            { path: "product-details/:id", element: <ProductDetails /> },
            { path: "cart", element: <Cart /> },
            { path: "checkout", element: <Checkout /> },
            { path: "order-placed/:orderId", element: <OrderPlaced /> },
            { path: "orders", element: <Orders /> },
            { path: "wishlist", element: <Wishlist /> },
          ],
        },
        {
          path: "admin",
          element: (
            <ProtectedRoutes requiredRole="admin">
              <AdminLayout />
            </ProtectedRoutes>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="/admin/products/add" replace />,
            },
            { path: "products/add", element: <AdminAddProduct /> },
            { path: "products/update", element: <AdminUpdateProduct /> },
            { path: "products/delete", element: <AdminDeleteProduct /> },
          ],
        },
        { path: "*", element: <NotFound /> },
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
