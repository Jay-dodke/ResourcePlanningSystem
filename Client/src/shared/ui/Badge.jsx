import clsx from "clsx";

const Badge = ({tone = "neutral", className, children}) => {
  const tones = {
    neutral: "badge-neutral",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
  };

  return <span className={clsx("badge", tones[tone], className)}>{children}</span>;
};

export default Badge;






