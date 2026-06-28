const API_BASE = 'http://localhost:8080/api';

export const parseTransaction = async (rawMessage) => {
  const res = await fetch(`${API_BASE}/transactions/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawMessage })
  });
  return res.json();
};

export const getTransactions = async () => {
  const res = await fetch(`${API_BASE}/transactions`);
  return res.json();
};

export const getMetrics = async () => {
  const res = await fetch(`${API_BASE}/transactions/metrics`);
  return res.json();
};

export const updateCategory = async (id, category) => {
  const res = await fetch(`${API_BASE}/transactions/${id}/category`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category })
  });
  return res.json();
};
