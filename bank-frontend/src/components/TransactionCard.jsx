import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const CATEGORIES = ['Food & Dining', 'Travel', 'Salary', 'Miscellaneous'];

const TransactionCard = ({ tx, onCategoryChange, index }) => {
  const isCredit = tx.type === 'CREDIT';

  return (
    <motion.div
      className={`transaction-card ${isCredit ? 'credit' : 'debit'}`}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -2, boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}
    >
      <div className="card-top">
        <div className="tx-desc">{tx.description}</div>
        <div className={`tx-amount ${isCredit ? 'amount-in' : 'amount-out'}`}>
          {isCredit ? '+' : '−'} ₹{tx.amount.toLocaleString()}
        </div>
      </div>

      <div className="card-bottom">
        <div className="tx-date">
          {isCredit ? (
            <ArrowDownLeft size={13} color="var(--accent-green)" />
          ) : (
            <ArrowUpRight size={13} color="#f43f5e" />
          )}
          {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
        </div>

        <select
          className="category-select"
          value={tx.category || 'Miscellaneous'}
          onChange={(e) => onCategoryChange(tx.id, e.target.value)}
        >
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {tx.expectedSavings != null && tx.expectedSavings > 0 && (
        <motion.div
          className="expected-savings"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Sparkles size={15} />
          <span>You earned ₹{tx.expectedSavings} in Expected Savings!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TransactionCard;
