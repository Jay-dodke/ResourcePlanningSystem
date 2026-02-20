import clsx from "clsx";

const Button = ({variant = "primary", className, ...props}) => {
  const styles = {
    primary: "bg-accent text-[color:rgb(var(--bg-primary))] hover:bg-accent-strong",
    ghost: "bg-transparent text-primary hover:bg-[color:rgb(var(--surface-hover))]",
    outline: "border border-default text-primary hover:bg-[color:rgb(var(--surface-hover))]",
  };

  return (
    <button
      className={clsx(
        "rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className
      )}
      {...props}
    />
  );
};

export default Button;



