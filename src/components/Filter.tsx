import { useSearchParams } from "react-router-dom";

type FilterOption = {
  value: string;
  label: string;
};

type FilterProps = {
  filterField: string;
  options: FilterOption[];
};

export default function Filter({ filterField, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options.at(0)?.value;

  const handleClick = (value: string) => {
    searchParams.set(filterField, value);
    if (Number(searchParams.get("page")) > 1) searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  return (
    <div className="border border-accent-500 bg-component-bg shadow-md rounded-md p-1 flex items-center gap-1">
      {options.map((option) => (
        <button
          className={`border-none rounded-md font-medium text-sm px-1 py-2 hover:not-disabled:bg-accent-700 hover:not-disabled:text-light-100 ${currentFilter === option.value && "bg-accent-700 text-light-100"} transition-all`}
          onClick={() => handleClick(option.value)}
          key={`${option.label}-${option.value}`}
          disabled={currentFilter === option.value}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
