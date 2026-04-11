import type { ComponentPropsWithRef, Ref } from "react";

type FormInputProps = ComponentPropsWithRef<"input"> & {
  label?: string;
  placeholder?: string;
  id: string;
  ref: Ref<HTMLInputElement>;
};

export default function FormInput({ label, placeholder, id, name, ref, ...props }: FormInputProps) {
  return (
    <p>
      {label && <label htmlFor={id}>{label}</label>}
      <input type="text" placeholder={placeholder} id={id} name={name} ref={ref} {...props} />
    </p>
  );
}
