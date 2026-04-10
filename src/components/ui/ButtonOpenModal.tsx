import { useImperativeHandle, type ReactElement, type Ref } from "react";
import Button from "./Button";
import { useModal } from "./Modal";

type ButtonOpenModalProps = {
  buttonType: "primary" | "custom";
  label?: string;
  CustomButton?: ReactElement;
  ref: Ref<unknown>;
};

export default function ButtonOpenModal({
  buttonType,
  label,
  CustomButton,
  ref,
  ...props
}: ButtonOpenModalProps) {
  const { setModalIsOpen } = useModal();

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalIsOpen(true);
    },
  }));

  function handleOpenModal() {
    setModalIsOpen(true);
  }

  if (buttonType === "primary")
    return (
      <Button onClick={handleOpenModal} {...props}>
        {label}
      </Button>
    );

  if (buttonType === "custom")
    return (
      <div role="button" className="grid" onClick={handleOpenModal} {...props}>
        {CustomButton}
      </div>
    );
}
