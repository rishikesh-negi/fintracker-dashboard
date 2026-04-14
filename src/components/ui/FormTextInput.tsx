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
    <p className="w-full flex flex-col gap-0.5">
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm xl:text-lg">
          {label}:
        </label>
      )}
      <input type={type} placeholder={placeholder} id={id} name={name} ref={ref} {...props} />
    </p>
  );
}
