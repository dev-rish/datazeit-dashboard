import React from "react";

const Checkbox = ({ label = 'Checkbox', ...props }) => {
  return (
    <div className="form-check flex items-center">
      <input
        className="align-middle form-check-input h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 bg-no-repeat bg-center bg-contain mr-3 cursor-pointer"
        type="checkbox"
        value=""
        id="flexCheckChecked"
        {...props}
      />
      <label
        className="form-check-label inline-block"
        htmlFor="flexCheckChecked"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
