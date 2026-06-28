import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { getTransactions, getMetrics, parseTransaction, updateCategory } from './services/api';
import VisualAnalyticsBlock from './components/VisualAnalyticsBlock';
import InputSimulator from './components/InputSimulator';
import TransactionStream from './components/TransactionStream';
import './index.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({});

  const refreshData = async () => {
    try {
      const txData = await getTransactions();
      const txMetrics = await getMetrics();
      setTransactions(txData.sort((a, b) => b.id - a.id));
      setMetrics(txMetrics);
    } catch (e) {
      console.error('Failed to fetch data:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSimulate = async (rawMessage) => {
    await parseTransaction(rawMessage);
    refreshData();
  };

  const handleCategoryChange = async (id, newCategory) => {
    await updateCategory(id, newCategory);
    refreshData();
  };

  // Income comes from the dedicated backend key (all CREDIT transactions)
  const totalIncome = metrics['__TOTAL_INCOME__'] || 0;

  // Expenses = all category buckets except the reserved income key
  const totalExpense = Object.entries(metrics).reduce((acc, [key, val]) => {
    return key === '__TOTAL_INCOME__' ? acc : acc + val;
  }, 0);

  return (
    <div className="app-container">
      {/* Premium App Header */}
      <motion.div
        className="app-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="app-header-icon">
          <Wallet size={20} color="white" />
        </div>
        <div>
          <h1>Money Manager</h1>
          <p>UPI Transaction Tracker &amp; Insights</p>
        </div>
      </motion.div>

      <VisualAnalyticsBlock metrics={metrics} totalDebit={totalExpense} totalIncome={totalIncome} />

      <InputSimulator onSimulate={handleSimulate} />

      <p className="section-title">Recent Transactions</p>
      <TransactionStream transactions={transactions} onCategoryChange={handleCategoryChange} />
    </div>
  );
}

export default App;
