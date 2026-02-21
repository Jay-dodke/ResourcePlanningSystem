import {useMemo} from "react";
import {useAuthStore} from "../../store/useAuthStore";

export const usePermissions = () => {
  const permissions = useAuthStore((state) => state.user?.permissions || []);

  const can = useMemo(() => {
    return (permission) => permissions.includes(permission);
  }, [permissions]);

  return {permissions, can};
};
