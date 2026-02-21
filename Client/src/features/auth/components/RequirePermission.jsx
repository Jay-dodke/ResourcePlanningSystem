import Alert from "../../../shared/ui/Alert";
import {useAuthStore} from "../../../store/useAuthStore";

const hasPermission = (user, permission) => {
  if (!permission) return true;
  const roleName = user?.role || user?.roleId?.name || user?.roleId || "";
  if (roleName.toLowerCase() === "admin") return true;
  const list = user?.permissions || [];
  return list.includes(permission);
};

const RequirePermission = ({permission, children}) => {
  const user = useAuthStore((state) => state.user);

  if (!hasPermission(user, permission)) {
    return (
      <section className="panel p-6">
        <Alert tone="warning">You don&apos;t have permission to access this area.</Alert>
      </section>
    );
  }

  return children;
};

export default RequirePermission;




