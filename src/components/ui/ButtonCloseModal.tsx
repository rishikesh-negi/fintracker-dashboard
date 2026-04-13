import type { ComponentPropsWithoutRef, MouseEventHandler } from "react";

type ButtonCloseModalProps = ComponentPropsWithoutRef<"button"> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonCloseModal({ onClick, ...props }: ButtonCloseModalProps) {
  return (
    <button
      className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center aspect-square rounded-full shadow-[0_1px_5px_rgba(0,0,0,0.25)] border border-accent-700 text-accent-700 text-md xl:text-lg cursor-pointer hover:bg-accent-700 hover:text-component-bg duration-75"
      onClick={onClick}
      {...props}>
      &times;
    </button>
  );
}
