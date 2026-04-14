import { useRef, useState, type ChangeEvent } from "react";
import { editTransaction, type Transaction, type TransactionCategory } from "../store/accountSlice";
import { useAppDispatch } from "../store/storeHooks";
import { useMenu } from "./Menu";
import Button from "./ui/Button";
import ButtonCloseModal from "./ui/ButtonCloseModal";
import Form, { type FormApi } from "./ui/Form";
import FormSelectInput from "./ui/FormSelectInput";
import FormTextInput from "./ui/FormTextInput";
import { useModal } from "./ui/Modal";
import { getCategoriesByTransactionType } from "../utils/getCategoriesByTransactionType";

type EditTransactionFormProps = {
  transaction: Transaction;
};

export default function EditTransactionForm({ transaction }: EditTransactionFormProps) {
  const form = useRef<FormApi>(null);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    transaction.transactionType,
  );
  const transactionTypeRef = useRef<"income" | "expense">(transactionType);
  const [categoryOptions, setCategoryOptions] = useState<{ label: string; value: string }[]>(
    getCategoriesByTransactionType(transaction.transactionType),
  );
  const dispatch = useAppDispatch();
  const { setModalIsOpen } = useModal();
  const { close } = useMenu();

  function onSave(value: {
    amount: string;
    description: string;
    transactionType: "income" | "expense";
    category: TransactionCategory;
  }) {
    dispatch(editTransaction({ id: transaction.transactionId, ...value }));
    form.current?.clear();
    setModalIsOpen(false);
    close();
  }

  function handleTransactionTypeChange(e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) {
    transactionTypeRef.current = e.target.value as "income" | "expense";
    setCategoryOptions(getCategoriesByTransactionType(transactionTypeRef.current));
  }

  return (
    <Form
      ref={form}
      onSave={onSave as <T>(value: T) => void}
      className="component-container w-[80dvw] md:w-[60dvw] lg:w-[40dvw] xl:w-[30dvw] h-fit flex flex-col gap-4 lg:gap-6 shadow-lg text-text">
      <h4 className="component-heading mb-2 lg:mb-0">
        <ButtonCloseModal onClick={() => setModalIsOpen(false)} />
        Edit transaction {transaction.transactionId}
      </h4>
      <FormTextInput
        label="Amount"
        type="number"
        step="any"
        id="amount"
        name="amount"
        className="edit-transaction-form-input number-input-reset"
        defaultValue={transaction.amount}
      />
      <FormTextInput
        label="Description"
        type="text"
        id="description"
        name="description"
        className="edit-transaction-form-input"
        defaultValue={transaction.description}
      />
      <FormSelectInput
        label="Transaction type"
        id="transactionType"
        name="transactionType"
        options={[
          { label: "Income", value: "income" },
          { label: "Expense", value: "expense" },
        ]}
        className="edit-transaction-form-input"
        defaultValue={transactionType}
        onChange={handleTransactionTypeChange}
      />
      <FormSelectInput
        label="Category"
        id="category"
        name="category"
        options={categoryOptions}
        className="edit-transaction-form-input"
        defaultValue={transactionType}
        onChange={(e) => setTransactionType(e.target.value as "income" | "expense")}
      />
      <Button className="w-fit px-4 py-1 ml-auto rounded-sm bg-accent-700 hover:bg-accent-900 text-light-50 text-xs lg:text-sm font-semibold cursor-pointer tracking-wide">
        Edit
      </Button>
    </Form>
  );
}
