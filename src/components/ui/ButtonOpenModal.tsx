import type { ReactElement } from "react";
import Button from "./Button";
import { useModal } from "./Modal";

type ButtonOpenModalProps = {
  buttonType: "primary" | "custom";
  label?: string;
  CustomButton?: ReactElement<HTMLButtonElement>;
};

export default function ButtonOpenModal({
  buttonType,
  label,
  CustomButton,
  ...props
}: ButtonOpenModalProps) {
  const { setModalIsOpen } = useModal();

  if (buttonType === "primary")
    return (
      <Button onClick={() => setModalIsOpen(true)} {...props}>
        {label}
      </Button>
    );

  if (buttonType === "custom")
    return (
      <div role="button" className="grid" onClick={() => setModalIsOpen(true)} {...props}>
        {CustomButton}
      </div>
    );
}
