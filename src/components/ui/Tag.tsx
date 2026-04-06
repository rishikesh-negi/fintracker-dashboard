import type { ComponentPropsWithoutRef } from "react";

type TagProps = ComponentPropsWithoutRef<"span"> & {
  bgColor: string;
  text: string;
};

export default function Tag({ bgColor, text, ...props }: TagProps) {
  return (
    <span
      {...props}
      className={`${bgColor} w-fit flex items-center justify-center text-[0.6rem] font-bold px-2 py-0.5 rounded-full text-light-200 uppercase`}>
      {text}
    </span>
  );
}
