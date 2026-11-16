import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const ProtectedRoutes = ({ children, requiredRole }) => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoutes;
