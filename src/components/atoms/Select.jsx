import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  placeholder,
  className, 
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          "input-field",
          error && "border-error-500 focus:ring-error-500 focus:border-error-500",
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value || option.id} value={option.value || option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;