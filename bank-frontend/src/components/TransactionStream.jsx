import React from 'react';
import { AnimatePresence } from 'framer-motion';
import TransactionCard from './TransactionCard';

const TransactionStream = ({ transactions, onCategoryChange }) => {
  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        No transactions yet.<br />Paste an SMS above to start!
      </div>
    );
  }

  return (
    <div className="transaction-stream">
      <AnimatePresence>
        {transactions.map((tx, i) => (
          <TransactionCard
            key={tx.id}
            tx={tx}
            index={i}
            onCategoryChange={onCategoryChange}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionStream;
