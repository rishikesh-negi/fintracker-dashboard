import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  modalContent: ReactElement;
  children: ReactNode;
};

export type ModalContextValue = {
  modalRef: RefObject<HTMLDialogElement | null>;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export default function ModalProvider({ children, modalContent, ...props }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (modalIsOpen) modalRef.current?.showModal();
  }, [modalIsOpen]);

  const handleOutsideClick: MouseEventHandler<HTMLDialogElement> = (e) => {
    if (e.target === modalRef.current) {
      modalRef.current.close();
      setModalIsOpen(false);
    }
  };

  return (
    <ModalContext.Provider value={{ modalRef, setModalIsOpen }}>
      {children}
      {modalIsOpen
        ? createPortal(
            <dialog
              className="fixed inset-0 m-auto p-0 rounded-md backdrop:bg-dark-500/75 backdrop:backdrop-blur-[5px]"
              onClick={handleOutsideClick}
              ref={modalRef}
              {...props}>
              <div className="component-container">{modalContent}</div>
            </dialog>,
            document.getElementById("modal-root")!,
          )
        : null}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = use(ModalContext);
  if (!context) throw new Error("Context was used outside its provider");
  return context;
}
