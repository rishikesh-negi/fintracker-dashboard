import type { ComponentPropsWithRef, Ref } from "react";

type FormInputProps = ComponentPropsWithRef<"input"> & {
  label?: string;
  placeholder?: string;
  type: "text" | "number";
  id: string;
  ref?: Ref<HTMLInputElement>;
};

export default function FormTextInput({
  label,
  placeholder,
  type,
  id,
  name,
  ref,
  ...props
}: FormInputProps) {
  return (
    <p className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm">
          {label}:
        </label>
      )}
      <input type={type} placeholder={placeholder} id={id} name={name} ref={ref} {...props} />
    </p>
  );
}
