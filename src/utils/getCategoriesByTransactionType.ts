export function getCategoriesByTransactionType(type: "income" | "expense") {
  return [
    ...(type === "income"
      ? [
          { label: "Salary", value: "salary" },
          { label: "Dividend", value: "dividend" },
        ]
      : []),
    ...(type === "expense"
      ? [
          { label: "Utility", value: "utility" },
          { label: "Lifestyle", value: "lifestyle" },
          { label: "Transit", value: "transit" },
          { label: "Essentials", value: "essentials" },
          { label: "Installment", value: "installment" },
          { label: "Investment", value: "investment" },
        ]
      : []),
  ];
}
