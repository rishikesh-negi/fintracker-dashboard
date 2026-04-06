import { HiMoon, HiSun } from "react-icons/hi2";
import { useDarkMode } from "../../contexts/DarkModeContext";
import RoleToggler from "../RoleToggler";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header
      className={`col-span-1 sm:col-start-2 sm:col-end-3 row-span-1 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between border-b bg-component-bg ${isDarkMode ? "border-dark-700" : "border-light-300"}`}>
      <img src="/logo.png" className="w-24 sm:hidden" alt="Platform logo" />
      <div className="flex items-center gap-3 sm:w-full sm:justify-between">
        <RoleToggler />
        <button
          className="p-1 rounded-md flex items-center justify-center cursor-pointer hover:bg-accent-100/25"
          onClick={toggleDarkMode}>
          {isDarkMode ? (
            <HiSun className="text-xl md:text-2xl text-accent-500" />
          ) : (
            <HiMoon className="text-xl md:text-2xl text-accent-500" />
          )}
        </button>
      </div>
    </header>
  );
}
