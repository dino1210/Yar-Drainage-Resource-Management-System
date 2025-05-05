// components/RoleBasedRoute.tsx
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute = ({ children, allowedRoles }: RoleBasedRouteProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/*" replace />;
  }

  return children;
};

export default RoleBasedRoute;
