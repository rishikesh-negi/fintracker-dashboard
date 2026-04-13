import {
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  type SubmitEvent,
} from "react";

export type FormApi = {
  clear: () => void;
};

type FormProps = ComponentPropsWithoutRef<"form"> & {
  children: ReactNode;
  id?: string;
  onSave: (value: unknown) => void;
  ref?: Ref<FormApi>;
};

export default function Form({ children, id, onSave, ref, ...props }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    clear: () => formRef.current?.reset(),
  }));

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSave(data);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} id={id} {...props}>
      {children}
    </form>
  );
}
