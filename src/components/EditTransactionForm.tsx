import { useRef } from "react";
import Form, { type FormApi } from "./ui/Form";
import type { Transaction } from "../store/accountSlice";
import FormTextInput from "./ui/FormTextInput";
import { useModal } from "./ui/Modal";
import ButtonCloseModal from "./ui/ButtonCloseModal";

type EditTransactionFormProps = {
  transaction: Transaction;
};

export default function EditTransactionForm({ transaction }: EditTransactionFormProps) {
  const form = useRef<FormApi>(null);

  function onFormSubmit() {
    form.current?.clear();
  }

  const { setModalIsOpen } = useModal();

  return (
    <Form
      ref={form}
      onSave={onFormSubmit}
      className="component-container border border-accent-900 flex flex-col gap-2 lg:gap-3 w-full h-fit text-text">
      <h4 className="component-heading mb-2 lg:my-4">
        <ButtonCloseModal onClick={() => setModalIsOpen(false)} />
        Edit transaction {transaction.transactionId}
      </h4>
      <FormTextInput
        label="amount"
        type="number"
        id="transaction-amount"
        name="transaction-amount"
        className="w-full px-2 md:px-3 py-1 md:py-1.5 rounded-sm text-sm md:text-lg bg-backdrop outline-0 border border-accent-900 number-input-reset focus-visible:border-accent-500"
      />
    </Form>
  );
}
