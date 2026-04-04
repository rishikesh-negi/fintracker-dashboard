import SummaryCard from "../components/SummaryCard";

export default function Dashboard() {
  return (
    <div className="w-full min-h-full grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 grid-rows-[repeat(8,auto)] gap-x-1 gap-y-2">
      <SummaryCard />
    </div>
  );
}
