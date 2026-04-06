import { Outlet } from "react-router-dom";
import { MobileSideNavToggleProvider } from "../../contexts/MobileSideNavContext";
import SideNavigation from "../SideNavigation";
import Header from "./Header";

export default function AppLayout() {
  return (
    <div className="relative w-full h-dvh grid grid-cols-[1fr] sm:grid-cols-[25%_1fr] md:grid-cols-[20%_1fr] xl:grid-cols-[18%_1fr] 2xl:grid-cols-[15%_1fr] grid-rows-[auto_1fr] bg-backdrop text-text">
      <Header />
      <MobileSideNavToggleProvider>
        <SideNavigation />
      </MobileSideNavToggleProvider>

      <main className="col-span-1 sm:col-start-2 sm:col-end-3 row-start-2 row-end-3 bg-backdrop grid overflow-y-auto styled-scrollbar">
        <div className="max-w-7xl w-full px-6 md:px-8 lg:px-12 xl:px-20 py-4 md:py-6 lg-py-8 xl:py-10 mx-auto flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
