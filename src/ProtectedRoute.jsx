
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("authToken"); 

  return isLoggedIn ? children : <Navigate to="/login-page" replace />;
}

export default ProtectedRoute;
