import React from "react";

const Badge = ({
  text = "Info",
  color = "blue",
  classNames = "",
  rounded = false,
  ...props
}) => {
  return (
    <span
      className={`text-xs capitalize inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap font-bold bg-${color}-200 text-${color}-500 rounded${
        rounded ? "-full" : ""
      } mx-1 ${classNames}`}
      {...props}
    >
      {text}
    </span>
  );
};

export default Badge;
