import React from 'react';
import TransactionList from '../components/TransactionList';
import { Plus } from 'lucide-react';

export default function TransactionView({
  transactions,
  onDeleteTransaction,
  onOpenAddModal,
}) {
  return (
    <div className="transaction-view-wrapper">
      <TransactionList
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
        onOpenAddModal={onOpenAddModal}
      />
    </div>
  );
}
