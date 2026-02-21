import clsx from "clsx";

const SidebarSection = ({title, collapsed, children}) => {
  return (
    <div className="space-y-2">
      <p
        className={clsx(
          "px-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-secondary",
          collapsed && "sr-only"
        )}
      >
        {title}
      </p>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export default SidebarSection;



