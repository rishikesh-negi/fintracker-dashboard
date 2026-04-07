import type { ReactElement } from "react";
import {
  HiOutlineArrowLeftCircle,
  HiOutlineArrowsRightLeft,
  HiOutlineBars3BottomRight,
  HiOutlineHome,
  HiOutlinePresentationChartBar,
  HiOutlineArrowRightEndOnRectangle,
} from "react-icons/hi2";
import { useSideNavToggle } from "../contexts/MobileSideNavContext";
import SideNavLink from "./SideNavLink";
import { useDarkMode } from "../contexts/DarkModeContext";

export type SideNavLinkType = {
  name: string;
  href: string;
  icon: ReactElement;
};

const sideNavLinks: SideNavLinkType[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: <HiOutlineHome className="text-xl" />,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: <HiOutlineArrowsRightLeft className="text-xl" />,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: <HiOutlinePresentationChartBar className="text-xl" />,
  },
];

export default function SideNavigation() {
  const { sideNavIsOpen, setSideNavIsOpen } = useSideNavToggle();
  const { isDarkMode } = useDarkMode();

  const handleToggleSideNav = () => setSideNavIsOpen((curr) => !curr);

  return (
    <aside
      className={`absolute sm:static inset-0 sm:inset-auto w-[70%] sm:w-full z-20 col-span-1 row-span-full flex flex-col bg-dark-800 transition-all text-light-200 ${sideNavIsOpen ? "translate-0" : "-translate-x-full"} sm:translate-0`}>
      <div className="relative py-4 mb-4">
        <img src="/logo.png" className="w-32 sm:w-24 md:w-32 block mx-auto" alt="Platform logo" />

        <button
          className={`absolute p-2 pl-1 right-0 top-1/2 translate-x-full flex items-center justify-center bg-dark-800 rounded-br-full rounded-tr-full border-l border-dark-300 sm:hidden cursor-pointer ${isDarkMode && "shadow-[0.2rem_0.5rem_0.8rem_0.2rem_rgba(0,0,0,0.4)] outline outline-dark-500"}`}
          onClick={handleToggleSideNav}>
          {sideNavIsOpen ? (
            <HiOutlineArrowLeftCircle className="text-xl text-light-300" />
          ) : (
            <HiOutlineBars3BottomRight className="text-xl text-light-300" />
          )}
        </button>
      </div>

      <ul>
        {sideNavLinks.map((link) => (
          <SideNavLink link={link} key={`${link.name}${link.href}`} />
        ))}
      </ul>

      <button className="w-full px-8 sm:px-5 lg:px-6 xl:px-8 py-4 text-sm sm:text-md flex items-center gap-4 sm:gap-3 lg:gap-5 mt-auto border-t border-dark-500 hover:bg-dark-500 cursor-pointer">
        <HiOutlineArrowRightEndOnRectangle className="text-xl" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
