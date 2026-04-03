import SideNavigation from "../SideNavigation";

export default function AppLayout() {
  return (
    <div className="relative w-full h-dvh grid grid-cols-[1fr] grid-rows-[auto_1fr] bg-backdrop text-text sm:grid-cols-[25%_1fr] md:grid-cols-[20%_1fr] xl:grid-cols-[18%_1fr] 2xl:grid-cols-[15%_1fr]">
      <SideNavigation />
    </div>
  );
}
