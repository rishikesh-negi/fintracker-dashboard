import { useLocation } from "react-router-dom";
import type { SideNavLinkType } from "./SideNavigation";
import { useSideNavToggle } from "../contexts/MobileSideNavContext";

type SideNavLinkProps = {
  link: SideNavLinkType;
};

export default function SideNavLink({ link }: SideNavLinkProps) {
  const urlLocation = useLocation();
  const { sideNavIsOpen } = useSideNavToggle();

  return (
    <li
      className={`w-full px-8 sm:px-5 lg:px-6 xl:px-8 py-3 text-sm sm:text-md hover:bg-dark-500 ${link.href === urlLocation.pathname && "bg-dark-600 border-l-4 border-accent-500"}`}
      tabIndex={sideNavIsOpen ? 1 : 0}>
      <a
        href={link.href}
        className={`flex items-center gap-4 sm:gap-3 lg:gap-5 ${link.href === urlLocation.pathname && "-translate-x-1 text-accent-100"}`}>
        {link.icon}
        <span>{link.name}</span>
      </a>
    </li>
  );
}
