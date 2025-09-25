import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { accessToken, roles: userRoles } = useUserStore();

  if (!accessToken) return <Navigate to="/login" replace />;

  if (roles && !roles.some((role) => userRoles.includes(role))) {
    return <div>You are not authorized to view this page.</div>;
  }

  return children;
};

export default ProtectedRoute;
