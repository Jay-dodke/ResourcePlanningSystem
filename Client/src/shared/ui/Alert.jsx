import clsx from "clsx";

const tones = {
  info: "border border-default bg-secondary text-primary",
  success: "border border-success/30 bg-success/10 text-success",
  warning: "border border-warning/30 bg-warning/10 text-warning",
  error: "border border-danger/30 bg-danger/10 text-danger",
};

const Alert = ({tone = "info", className, children}) => {
  return (
    <div className={clsx("rounded-2xl px-4 py-3 text-sm", tones[tone], className)}>{children}</div>
  );
};

export default Alert;



