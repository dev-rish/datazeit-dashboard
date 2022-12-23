import React from "react";
import classNames from "classnames";

const Button = ({
  children = "Button",
  color = "blue",
  outline = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames(
        "inline-block font-semibold text-sm leading-tight rounded-lg transition duration-150 ease-in-out m-2",
        className,
        {
          // solid button
          [`px-6 py-2.5 bg-${color}-${disabled ? 400 : 600} text-gray-${
            disabled ? 200 : 100
          } shadow-md focus:bg-${color}-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-${color}-800 active:shadow-lg`]:
            !outline,
          [`hover:bg-${color}-700 hover:shadow-lg`]: !outline && !disabled,

          // outline button
          [`px-6 py-2 border-2 border-${color}-600 text-${color}-${
            disabled ? 400 : 600
          } focus:outline-none focus:ring-0`]: outline,
          [`hover:bg-black hover:bg-opacity-5`]: outline && !disabled,
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
