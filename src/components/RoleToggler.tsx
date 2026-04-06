import { selectCurrentRole, toggleRole } from "../store/accountSlice";
import type { FilterOption } from "./Filter";
import Filter from "./Filter";

const roles: FilterOption[] = [
  { label: "admin", value: "admin" },
  { label: "viewer", value: "viewer" },
];

export default function RoleToggler() {
  return (
    <Filter
      options={roles}
      filterField="role"
      stateSelector={selectCurrentRole}
      actionCreator={toggleRole}
    />
  );
}
