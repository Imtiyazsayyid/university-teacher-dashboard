"use client";

import React from "react";
import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface Props {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}: Props) => {
  return (
    <div>
      <label
        className="block text-md font-medium leading-6 text-gray-900 dark:text-gray-300"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          type={type}
          disabled={disabled}
          id={id}
          autoComplete={id}
          {...register(id, { required })}
          className={clsx(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            // Dark theme customization
            "dark:bg-[#151515] dark:placeholder:text-gray-400 dark:text-gray-200 dark:focus-visible:ring-violet-600 dark:focus-visible:ring-2",
            errors[id] && "focus-visible:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

export default Input;
