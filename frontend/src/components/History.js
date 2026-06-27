import React, { useState, useEffect } from 'react';
import { getHistory } from '../api';

const History = ({ userId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (userId) {
      getHistory(userId)
        .then(res => setHistory(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const filtered = filter === 'all' ? history : history.filter(t => t.status === filter);

  const getRiskColor = (score) => {
    if (score >= 70) return '#ef4444';
    if (score >= 40) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Transaction History</h2>

      <div style={styles.filters}>
        {['all', 'safe', 'blocked'].map(f => (
          <button
            key={f}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '📋 All' : f === 'safe' ? '✅ Safe' : '🚫 Blocked'}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>No transactions found</div>
      ) : (
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Receiver UPI</span>
            <span>Amount</span>
            <span>Risk Score</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {filtered.map(txn => (
            <div key={txn.id} style={styles.tableRow}>
              <span style={{ color: '#f1f5f9', fontSize: '14px' }}>{txn.receiver_upi}</span>
              <span style={{ color: '#f1f5f9', fontWeight: '600' }}>₹{txn.amount.toLocaleString()}</span>
              <span style={{ color: getRiskColor(txn.risk_score), fontWeight: '700' }}>{txn.risk_score}/100</span>
              <span>
                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  background: txn.status === 'blocked' ? '#450a0a' : '#052e16',
                  color: txn.status === 'blocked' ? '#ef4444' : '#22c55e',
                }}>
                  {txn.status === 'blocked' ? '🚫 Blocked' : '✅ Safe'}
                </span>
              </span>
              <span style={{ color: '#64748b', fontSize: '12px' }}>
                {new Date(txn.transaction_time).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  heading: { color: '#f1f5f9', fontSize: '22px', fontWeight: '600', marginBottom: '24px' },
  filters: { display: 'flex', gap: '12px', marginBottom: '20px' },
  filterBtn: {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid #334155',
    background: '#1e293b', color: '#94a3b8', cursor: 'pointer', fontSize: '13px',
  },
  filterActive: { background: '#3b82f6', color: 'white', borderColor: '#3b82f6' },
  empty: { color: '#64748b', textAlign: 'center', padding: '60px 0', fontSize: '14px' },
  table: { background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    padding: '14px 20px', background: '#0f172a',
    color: '#64748b', fontSize: '12px', textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    padding: '16px 20px', borderTop: '1px solid #334155',
    alignItems: 'center',
  },
};

export default History;