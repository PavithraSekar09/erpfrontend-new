import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toUpperCase();

  // check login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // check role (FIXED)
  if (
    allowedRoles &&
    !allowedRoles.map(r => r.toUpperCase()).includes(role)
  ) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;