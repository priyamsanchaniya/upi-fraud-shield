import React, { useState, useEffect } from 'react';
import { getStats } from '../api';

const Dashboard = ({ userId }) => {
  const [stats, setStats] = useState({
    total_transactions: 0,
    frauds_blocked: 0,
    amount_saved: 0
  });

  useEffect(() => {
    if (userId) {
      getStats(userId).then(res => setStats(res.data)).catch(() => {});
    }
  }, [userId]);

  const cards = [
    { label: 'Total Transactions', value: stats.total_transactions, icon: '💳', color: '#3b82f6' },
    { label: 'Frauds Blocked', value: stats.frauds_blocked, icon: '🚫', color: '#ef4444' },
    { label: 'Amount Saved', value: `₹${stats.amount_saved.toLocaleString()}`, icon: '💰', color: '#22c55e' },
    { label: 'AI Accuracy', value: '97.4%', icon: '🧠', color: '#a855f7' },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard Overview</h2>

      <div style={styles.grid}>
        {cards.map((card, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardTop}>
              <span style={styles.cardLabel}>{card.label}</span>
              <span style={styles.cardIcon}>{card.icon}</span>
            </div>
            <div style={{ ...styles.cardValue, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={styles.infoBox}>
        <div style={styles.infoTitle}>🛡️ How 5-Layer Detection Works</div>
        <div style={styles.layers}>
          {[
            { n: 1, name: 'Transaction Analysis', desc: 'Amount compared to your average spending' },
            { n: 2, name: 'Behavior Analysis', desc: 'Unusual time or pattern detection' },
            { n: 3, name: 'Device Trust Score', desc: 'Known vs unknown device check' },
            { n: 4, name: 'AI Anomaly Detection', desc: 'Receiver history and fraud flags' },
            { n: 5, name: 'Fraud Explanation', desc: 'Auto-generated report with reasons' },
          ].map(layer => (
            <div key={layer.n} style={styles.layer}>
              <div style={styles.layerNum}>{layer.n}</div>
              <div>
                <div style={styles.layerName}>{layer.name}</div>
                <div style={styles.layerDesc}>{layer.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  heading: { color: '#f1f5f9', fontSize: '22px', fontWeight: '600', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
  card: {
    background: '#1e293b', borderRadius: '12px',
    padding: '20px', border: '1px solid #334155',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardLabel: { color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  cardIcon: { fontSize: '22px' },
  cardValue: { fontSize: '28px', fontWeight: '700' },
  infoBox: { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' },
  infoTitle: { color: '#f1f5f9', fontSize: '16px', fontWeight: '600', marginBottom: '20px' },
  layers: { display: 'flex', flexDirection: 'column', gap: '16px' },
  layer: { display: 'flex', alignItems: 'flex-start', gap: '16px' },
  layerNum: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#3b82f6', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px', flexShrink: 0,
  },
  layerName: { color: '#f1f5f9', fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
  layerDesc: { color: '#64748b', fontSize: '13px' },
};

export default Dashboard;