import type { ComponentPropsWithoutRef, ReactNode } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  children: ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
