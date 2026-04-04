import {
  createContext,
  use,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type MobileSideNavToggleContextType = {
  sideNavIsOpen: boolean;
  setSideNavIsOpen: Dispatch<SetStateAction<boolean>>;
} | null;

const MobileSideNavToggleContext = createContext<MobileSideNavToggleContextType>(null);

type MobileSideNavToggleProviderProps = {
  children: ReactNode;
};

function MobileSideNavToggleProvider({ children }: MobileSideNavToggleProviderProps) {
  const [sideNavIsOpen, setSideNavIsOpen] = useState(false);

  return (
    <MobileSideNavToggleContext.Provider value={{ sideNavIsOpen, setSideNavIsOpen }}>
      {children}
    </MobileSideNavToggleContext.Provider>
  );
}

function useSideNavToggle() {
  const context = use(MobileSideNavToggleContext);
  if (!context) throw new Error("Context was used outside its provider");
  return context;
}

export { MobileSideNavToggleProvider, useSideNavToggle };
