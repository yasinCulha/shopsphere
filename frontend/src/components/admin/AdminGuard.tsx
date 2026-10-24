import { Navigate, Outlet } from "react-router-dom";
import { getAdminToken } from "../../services/adminService";

function AdminGuard() {
  return getAdminToken() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default AdminGuard;
