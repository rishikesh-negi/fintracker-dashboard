import {
  createContext,
  use,
  useState,
  type Dispatch,
  type MouseEventHandler,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
import { HiEllipsisVertical, HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "../hooks/useOutsideClick";

type MenuContextType = {
  openId: string;
  open: Dispatch<SetStateAction<string>>;
  close: () => void;
} | null;

const MenuContext = createContext<MenuContextType>(null);

export default function Menu({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string>("");

  const close = () => setOpenId("");
  const open = setOpenId;

  return (
    <MenuContext.Provider value={{ openId, open, close }}>
      <div className="relative flex items-center">{children}</div>
    </MenuContext.Provider>
  );
}

function Toggler({ id }: { id: string }) {
  const { openId, open, close } = use(MenuContext)!;

  function handleClick(e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (openId === "" || openId !== id) {
      open(id);
    } else close();
  }

  return (
    <button
      className={`absolute top-0 right-0 -translate-y-1/2 bg-none border-0 p-1 rounded-sm transition-all duration-200 hover:bg-backdrop cursor-pointer ${openId === id && "z-20 outline shadow-sm outline-faint-text/20 bg-component-bg hover:bg-backdrop"}`}
      onClick={handleClick}>
      {(!openId || openId === "") && <HiEllipsisVertical className="text-xl text-faint-text" />}
      {openId && openId !== "" && <HiXMark className="text-xl text-faint-text" />}
    </button>
  );
}

function Options({ children, id }: { children: ReactNode; id: string }) {
  const { openId, close } = use(MenuContext)!;
  const ref = useOutsideClick<HTMLDivElement>(close);

  if (openId !== id) {
    close();
    return null;
  }

  return (
    <div
      className="absolute z-10 top-1 right-0 py-1 flex flex-col outline outline-faint-text/20 rounded-md bg-component-bg shadow-md text-accent-500"
      ref={ref}>
      <ul className="w-full mt-2">{children}</ul>
    </div>
  );
}

function Option({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  // const { close } = use(MenuContext)!;

  function handleClick(e: ReactMouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    // close();
  }

  return (
    <li>
      <button
        className="w-full flex items-center gap-2 text-left bg-none py-1 xl:py-2 px-2 xl:px-4 text-xs lg:text-sm transition-all duration-200 hover:bg-backdrop cursor-pointer [&>svg]:transition-all [&>svg]:duration-200"
        onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </button>
    </li>
  );
}

Menu.Toggler = Toggler;
Menu.Options = Options;
Menu.Option = Option;
