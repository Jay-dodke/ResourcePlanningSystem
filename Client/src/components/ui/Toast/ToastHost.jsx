import {useEffect} from "react";
import {useUiStore} from "../../../store/useUiStore";
import clsx from "clsx";

const toneStyles = {
  info: "border border-default bg-secondary text-primary",
  success: "border border-success/30 bg-success/10 text-success",
  warning: "border border-warning/30 bg-warning/10 text-warning",
  error: "border border-danger/30 bg-danger/10 text-danger",
};

const ToastHost = () => {
  const toasts = useUiStore((state) => state.toasts);
  const removeToast = useUiStore((state) => state.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), toast.duration || 4000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "min-w-[240px] rounded-2xl px-4 py-3 text-sm shadow-lg",
            toneStyles[toast.type] || toneStyles.info
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <span>{toast.message}</span>
            <button
              className="text-xs text-secondary"
              onClick={() => removeToast(toast.id)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastHost;
