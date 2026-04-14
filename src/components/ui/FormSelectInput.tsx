import type { ComponentPropsWithoutRef } from "react";

type FormSelectInputProps = ComponentPropsWithoutRef<"select"> & {
  label?: string;
  id: string;
  name: string;
  options: { value: string; label: string }[];
};

export default function FormSelectInput({
  label,
  id,
  name,
  options,
  ...props
}: FormSelectInputProps) {
  return (
    <p className="w-full flex flex-col gap-0.5">
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm xl:text-lg">
          {label}:
        </label>
      )}
      <select name={name} id={id} {...props}>
        {options.map((op) => (
          <option value={op.value} key={`${op.label}-${op.value}`}>
            {op.label}
          </option>
        ))}
      </select>
    </p>
  );
}
