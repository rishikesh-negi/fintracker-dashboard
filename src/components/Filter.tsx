import type { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";

export type FilterOption = {
  label: string;
  value: string;
};

type FilterProps<T> = {
  options: FilterOption[];
  filterField: string;
  stateSelector: (state: RootState) => unknown;
  actionCreator: ActionCreatorWithPayload<T, string>;
};

export default function Filter<T>({
  options,
  filterField,
  stateSelector,
  actionCreator,
}: FilterProps<T>) {
  const currentFilter = useAppSelector(stateSelector);
  const dispatch = useAppDispatch();

  const handleClick = (value: string) => {
    if (currentFilter === value) return;
    dispatch(actionCreator({ [filterField]: value } as T));
  };

  return (
    <div className="w-fit bg-component-bg shadow-[0_3px_5px_1px_rgba(0,0,0,0.06)] rounded-md p-0.5 flex items-center gap-0.5">
      {options.map((option) => (
        <button
          className={`border-none rounded-sm sm:text-md font-bold text-xs xl:text-sm px-1 lg:px-2 py-0.5 sm:py-1 cursor-pointer hover:not-disabled:bg-accent-700 hover:not-disabled:text-light-100 ${currentFilter === option.value && "bg-accent-700 text-light-100"} transition-all`}
          onClick={() => handleClick(option.value)}
          key={`${option.label}-${option.value}`}
          disabled={currentFilter === option.value}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
