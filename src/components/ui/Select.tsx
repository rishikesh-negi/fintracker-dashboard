import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

type SelectInputProps = ComponentPropsWithoutRef<"select"> & {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => unknown;
};

export default function Select({ options, value, onChange, ...props }: SelectInputProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="px-2 py-1 bg-component-bg border-r-2 border-component-bg text-xs lg:text-sm rounded-sm font-semibold shadow-[0_3px_5px_1px_rgba(0,0,0,0.06)]"
      {...props}>
      {options.map((option) => (
        <option value={option.value} key={`${option.label}${option.value}`}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
