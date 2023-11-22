import { Navigate, Outlet } from "react-router-dom";
import { useApiStore } from "@/stores/apiStore";

interface Props {
  preventAuthorized?: boolean;
}

function RequireAuth({ preventAuthorized }: Props) {
  const authorized = useApiStore(state => state.userId);

  if (authorized && preventAuthorized) return <Navigate to="/home" replace />
  return authorized ? <Outlet /> : <Navigate to="/join" replace />
}

export default RequireAuth