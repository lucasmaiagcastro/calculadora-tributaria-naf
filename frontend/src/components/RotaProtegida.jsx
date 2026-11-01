import { Navigate, Outlet } from "react-router-dom";

export default function RotaProtegida() {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/inicio" replace />;
  }
  return <Outlet />;
}
