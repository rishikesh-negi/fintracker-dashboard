import { selectDashboardFilter, setDashboardFilter } from "../store/accountSlice";
import Filter, { type FilterOption } from "./Filter";

const options: FilterOption[] = [
  { label: "Current month", value: "current-month" },
  { label: "3M", value: "three-months" },
  { label: "Current year", value: "current-year" },
  { label: "1Y", value: "one-year" },
  { label: "All time", value: "all-time" },
];

export default function DashboardFilter() {
  return (
    <div className="w-full flex items-center justify-end">
      <Filter
        options={options}
        filterField="filter"
        stateSelector={selectDashboardFilter}
        actionCreator={setDashboardFilter}
      />
    </div>
  );
}
