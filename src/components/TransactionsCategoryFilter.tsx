export default function TransactionsCategoryFilter() {
  const categoryFilters = [
    "all",
    "utility",
    "lifestyle",
    "transit",
    "essentials",
    "installment",
    "investment",
  ];

  return (
    <select className="px-2 py-1 bg-component-bg border-r-2 border-component-bg" defaultValue="all">
      {categoryFilters.map((cat) => (
        <option value="all"></option>
      ))}
    </select>
  );
}
