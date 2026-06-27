import React, { useState } from 'react';
import { analyzeTransaction } from '../api';

const Analyzer = ({ userId }) => {
  const [form, setForm] = useState({ receiver_upi: '', amount: '', device_id: 'web-device-001' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!form.receiver_upi || !form.amount) return alert('બધા fields ભરો!');
    setLoading(true);
    try {
      const res = await analyzeTransaction(userId, {
        receiver_upi: form.receiver_upi,
        amount: parseFloat(form.amount),
        device_id: form.device_id,
      });
      setResult(res.data);
    } catch (e) {
      alert('Error: ' + e.message);
    }
    setLoading(false);
  };

  const getRiskColor = (score) => {
    if (score >= 70) return '#ef4444';
    if (score >= 40) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Analyze Transaction</h2>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Transaction Details</div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Receiver UPI ID</label>
            <input
              style={styles.input}
              placeholder="receiver@upi"
              value={form.receiver_upi}
              onChange={e => setForm({ ...form, receiver_upi: e.target.value })}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              style={styles.input}
              placeholder="Enter amount"
              type="number"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Device ID</label>
            <input
              style={styles.input}
              value={form.device_id}
              onChange={e => setForm({ ...form, device_id: e.target.value })}
            />
          </div>
          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? '🔄 Analyzing...' : '🔍 Run 5-Layer Analysis'}
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Analysis Result</div>
          {!result ? (
            <div style={styles.empty}>Enter transaction details and click analyze</div>
          ) : (
            <div>
              <div style={{ ...styles.verdict, background: result.status === 'blocked' ? '#450a0a' : '#052e16', borderColor: result.status === 'blocked' ? '#ef4444' : '#22c55e' }}>
                <div style={{ fontSize: '32px' }}>{result.status === 'blocked' ? '🚫' : '✅'}</div>
                <div>
                  <div style={{ color: result.status === 'blocked' ? '#ef4444' : '#22c55e', fontWeight: '700', fontSize: '18px' }}>
                    {result.status === 'blocked' ? 'TRANSACTION BLOCKED' : 'TRANSACTION SAFE'}
                  </div>
                  {result.fraud_reason && (
                    <div style={{ color: '#94a3b8', fontSize: '13px', marginTop: '4px' }}>{result.fraud_reason}</div>
                  )}
                </div>
              </div>

              <div style={styles.riskBar}>
                <div style={styles.riskLabel}>
                  <span style={{ color: '#94a3b8' }}>Overall Risk Score</span>
                  <span style={{ color: getRiskColor(result.risk_score), fontWeight: '700', fontSize: '20px' }}>{result.risk_score}/100</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{ ...styles.barFill, width: `${result.risk_score}%`, background: getRiskColor(result.risk_score) }} />
                </div>
              </div>

              <div style={styles.layerGrid}>
                {[
                  { label: 'Layer 1: Transaction', score: result.layer1 },
                  { label: 'Layer 2: Behavior', score: result.layer2 },
                  { label: 'Layer 3: Device', score: result.layer3 },
                  { label: 'Layer 4: AI Anomaly', score: result.layer4 },
                ].map((l, i) => (
                  <div key={i} style={styles.layerItem}>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{l.label}</div>
                    <div style={{ color: getRiskColor(l.score), fontWeight: '700', fontSize: '18px' }}>{l.score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  heading: { color: '#f1f5f9', fontSize: '22px', fontWeight: '600', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  card: { background: '#1e293b', borderRadius: '12px', padding: '24px', border: '1px solid #334155' },
  cardTitle: { color: '#f1f5f9', fontSize: '16px', fontWeight: '600', marginBottom: '20px' },
  formGroup: { marginBottom: '16px' },
  label: { color: '#94a3b8', fontSize: '12px', display: 'block', marginBottom: '6px' },
  input: {
    width: '100%', padding: '10px 14px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px',
    color: '#f1f5f9', fontSize: '14px', boxSizing: 'border-box',
  },
  btn: {
    width: '100%', padding: '12px', background: '#3b82f6',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
  },
  empty: { color: '#64748b', textAlign: 'center', padding: '40px 0', fontSize: '14px' },
  verdict: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px', borderRadius: '10px', border: '1px solid',
    marginBottom: '20px',
  },
  riskBar: { marginBottom: '20px' },
  riskLabel: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  barBg: { height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '4px', transition: 'width 0.5s' },
  layerGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  layerItem: {
    background: '#0f172a', borderRadius: '8px', padding: '12px',
    border: '1px solid #334155',
  },
};

export default Analyzer;