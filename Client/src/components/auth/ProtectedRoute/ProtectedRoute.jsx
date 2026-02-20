import {Navigate} from "react-router-dom";
import {useAuthStore} from "../../../store/useAuthStore";

const ProtectedRoute = ({children}) => {
  const token = useAuthStore((state) => state.accessToken);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;



