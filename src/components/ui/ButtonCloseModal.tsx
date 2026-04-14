import type { ComponentPropsWithoutRef, MouseEventHandler } from "react";

type ButtonCloseModalProps = ComponentPropsWithoutRef<"button"> & {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonCloseModal({ onClick, ...props }: ButtonCloseModalProps) {
  return (
    <button
      className="absolute top-2 md:top-4 right-2 md:right-4 w-5 md:w-6 h-5 md:h-6 aspect-square flex items-center justify-center rounded-full shadow-[0_3px_3px_1px_rgba(0,0,0,0.15)] text-text/60 text-sm md:text-lg xl:text-2xl cursor-pointer hover:bg-accent-700 hover:text-component-bg hover:shadow-none transition-all duration-75"
      onClick={onClick}
      {...props}>
      &times;
    </button>
  );
}
