import { useState } from "react";
export default function StarRating({ value, onChange, readonly = false, size = "md" }) {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-2xl";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${sizeClass} transition-transform ${
            !readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"
          }`}
        >
          <span
            className={
              star <= (hovered || value || 0)
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
