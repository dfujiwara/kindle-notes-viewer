import type { ButtonHTMLAttributes } from "react";

import { getCardButtonClassName } from "src/utils/styles";

type DetailCardButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  padding?: string;
};

export function DetailCardButton({
  className = "",
  padding = "p-3 md:p-4",
  type = "button",
  ...props
}: DetailCardButtonProps) {
  return (
    <button
      type={type}
      className={`${getCardButtonClassName(padding)} touch-manipulation ${className}`.trim()}
      {...props}
    />
  );
}
