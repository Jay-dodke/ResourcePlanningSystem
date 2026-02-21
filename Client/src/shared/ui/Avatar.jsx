import {useMemo, useState} from "react";
import clsx from "clsx";
import {resolveAssetUrl} from "../utils/assets";

const sizes = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar = ({src, name = "", size = "md"}) => {
  const safeSrc = resolveAssetUrl(String(src || "").trim());
  const [errorSrc, setErrorSrc] = useState("");
  const initials = useMemo(() => {
    if (!name) return "";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [name]);

  const showFallback = !safeSrc || errorSrc === safeSrc;

  return (
    <div
      className={clsx(
        "flex items-center justify-center overflow-hidden rounded-full border border-default bg-secondary text-primary",
        sizes[size] || sizes.md
      )}
    >
      {!showFallback ? (
        <img
          src={safeSrc}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setErrorSrc(safeSrc)}
        />
      ) : (
        <span className="font-semibold">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;



