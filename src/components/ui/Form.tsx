import {
  useImperativeHandle,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
  type Ref,
  type SubmitEvent,
} from "react";

type FormProps = ComponentPropsWithRef<"form"> & {
  children: ReactNode;
  id: string;
  onSubmit: (value: unknown) => void;
  ref: Ref<unknown>;
};

export default function Form({ children, id, onSubmit, ref, ...props }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    clear: () => formRef.current?.reset(),
  }));

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    onSubmit(data);
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      id={id}
      {...props}
      className="px-3 md:px-6 py-1 md:py-3 flex">
      {children}
    </form>
  );
}
