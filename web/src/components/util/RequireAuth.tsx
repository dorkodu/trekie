import { Navigate, Outlet } from "react-router-dom";
import { useApiStore } from "@/stores/apiStore";

function RequireAuth() {
  const authorized = useApiStore(state => state.userId);
  return authorized ? <Outlet /> : <Navigate to="/join" replace />
}

export default RequireAuth