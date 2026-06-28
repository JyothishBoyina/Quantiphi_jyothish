import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { key: 'Food & Dining', color: '#f59e0b', label: 'Food & Dining' },
  { key: 'Travel',        color: '#06b6d4', label: 'Travel'        },
  { key: 'Miscellaneous', color: '#a78bfa', label: 'Miscellaneous' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(13,21,41,0.95)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '10px',
        padding: '0.5rem 0.85rem',
        fontSize: '0.82rem',
        color: '#e2e8f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        <strong>{payload[0].name}</strong>
        <div style={{ color: payload[0].payload.color }}>₹{payload[0].value.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

const VisualAnalyticsBlock = ({ metrics, totalDebit, totalIncome }) => {
  const getPercent = (amount) => {
    if (!totalDebit || totalDebit === 0) return 0;
    return Math.round((amount / totalDebit) * 100);
  };

  // Build pie data from expense categories only (exclude reserved income key)
  const pieData = CATEGORIES.map(c => ({
    name: c.label,
    value: metrics[c.key] || 0,
    color: c.color,
  })).filter(d => d.value > 0);

  const hasPieData = pieData.length > 0;

  return (
    <motion.div
      className="analytics-block"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="analytics-header">
        <span>Monthly Summary</span>
        <span className="total-spent">₹{totalDebit.toLocaleString()} Spent</span>
      </div>

      {/* Stats Row */}
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card income">
          <span className="stat-label">💰 Total Income</span>
          <span className="stat-value">₹{totalIncome.toLocaleString()}</span>
        </div>
        <div className="stat-card expense">
          <span className="stat-label">💸 Total Spent</span>
          <span className="stat-value">₹{totalDebit.toLocaleString()}</span>
        </div>
      </div>

      {/* Donut Chart + Legend */}
      {hasPieData ? (
        <div className="chart-wrapper">
          <div style={{ width: 150, height: 150, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={900}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-legend">
            {CATEGORIES.map(c => (
              <div key={c.key} className="legend-item">
                <span className="legend-dot" style={{ background: c.color }} />
                <span className="legend-label">{c.label}</span>
                <span className="legend-value">
                  {getPercent(metrics[c.key] || 0)}%
                </span>
              </div>
            ))}
            <div className="legend-item">
              <span className="legend-dot" style={{ background: '#10b981' }} />
              <span className="legend-label">Salary</span>
              <span className="legend-value" style={{ color: '#10b981' }}>
                ₹{(totalIncome).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', textAlign: 'center', padding: '1rem 0' }}>
          No expense data yet — simulate a transaction to see charts!
        </div>
      )}

      {/* Progress Tracks */}
      <div className="progress-tracks">
        {CATEGORIES.map((c, i) => (
          <motion.div
            key={c.key}
            className="progress-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className="progress-label">
              <span>{c.label}</span>
              <span>{getPercent(metrics[c.key] || 0)}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className={`progress-bar-fill fill-${c.key === 'Food & Dining' ? 'food' : c.key === 'Travel' ? 'travel' : 'misc'}`}
                style={{ width: `${getPercent(metrics[c.key] || 0)}%` }}
              />
            </div>
          </motion.div>
        ))}

        {/* Salary income bar */}
        <motion.div
          className="progress-item"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.24, duration: 0.4 }}
        >
          <div className="progress-label">
            <span>Salary (Income)</span>
            <span style={{ color: 'var(--accent-green)' }}>
              ₹{totalIncome.toLocaleString()}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill fill-salary" style={{ width: totalIncome > 0 ? '100%' : '0%' }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VisualAnalyticsBlock;
