import clsx from "clsx";
import {resolveAssetUrl} from "../../../utils/assets";

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar = ({src, name = "", size = "md"}) => {
  const safeSrc = resolveAssetUrl(src || "");
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "";

  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-hidden rounded-full border border-default bg-secondary text-primary",
        sizes[size] || sizes.md
      )}
    >
      {safeSrc ? (
        <img src={safeSrc} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
