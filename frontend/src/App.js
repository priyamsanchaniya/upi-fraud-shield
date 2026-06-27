import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analyzer from './components/Analyzer';
import History from './components/History';
import Notifications from './components/Notifications';
import { login, register } from './api';

const App = () => {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', upi_id: '' });
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      if (isLogin) {
        const res = await login({ email: form.email, password: form.password });
        setUser(res.data);
      } else {
        const res = await register(form);
        const userData = {
          user_id: res.data.user[0],
          name: res.data.user[1],
          email: res.data.user[2],
        };
        setUser(userData);
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActive('dashboard');
    setForm({ name: '', email: '', password: '', upi_id: '' });
  };

  if (!user) {
    return (
      <div style={styles.authBg}>
        <div style={styles.authCard}>
          <div style={styles.authLogo}>🛡️</div>
          <h1 style={styles.authTitle}>UPI Fraud Shield</h1>
          <p style={styles.authSub}>AI-powered fraud detection system</p>

          <div style={styles.authTabs}>
            <button
              style={{ ...styles.tab, ...(isLogin ? styles.tabActive : {}) }}
              onClick={() => setIsLogin(true)}
            >Login</button>
            <button
              style={{ ...styles.tab, ...(!isLogin ? styles.tabActive : {}) }}
              onClick={() => setIsLogin(false)}
            >Register</button>
          </div>

          {!isLogin && (
            <>
              <input
                style={styles.authInput}
                placeholder="Full Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                style={styles.authInput}
                placeholder="UPI ID (optional)"
                value={form.upi_id}
                onChange={e => setForm({ ...form, upi_id: e.target.value })}
              />
            </>
          )}
          <input
            style={styles.authInput}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            style={styles.authInput}
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.authBtn} onClick={handleAuth}>
            {isLogin ? '🔐 Login' : '📝 Register'}
          </button>
        </div>
      </div>
    );
  }

  const userId = user.user_id || user.id;

  const renderPage = () => {
    switch (active) {
      case 'dashboard': return <Dashboard userId={userId} />;
      case 'analyzer': return <Analyzer userId={userId} />;
      case 'history': return <History userId={userId} />;
      case 'notifications': return <Notifications userId={userId} />;
      default: return <Dashboard userId={userId} />;
    }
  };

  return (
    <div style={styles.app}>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={handleLogout} />
      <div style={styles.main}>{renderPage()}</div>
    </div>
  );
};

const styles = {
  app: { display: 'flex', height: '100vh', background: '#0f172a' },
  main: { flex: 1, overflowY: 'auto', background: '#0f172a' },
  authBg: {
    minHeight: '100vh', background: '#0f172a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  authCard: {
    background: '#1e293b', borderRadius: '16px', padding: '40px',
    width: '400px', border: '1px solid #334155', textAlign: 'center',
  },
  authLogo: { fontSize: '48px', marginBottom: '16px' },
  authTitle: { color: '#f1f5f9', fontSize: '24px', fontWeight: '700', marginBottom: '8px' },
  authSub: { color: '#64748b', fontSize: '14px', marginBottom: '24px' },
  authTabs: { display: 'flex', marginBottom: '20px', background: '#0f172a', borderRadius: '8px', padding: '4px' },
  tab: {
    flex: 1, padding: '8px', border: 'none', borderRadius: '6px',
    background: 'transparent', color: '#64748b', cursor: 'pointer', fontSize: '14px',
  },
  tabActive: { background: '#3b82f6', color: 'white' },
  authInput: {
    width: '100%', padding: '12px 16px', background: '#0f172a',
    border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9',
    fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box',
  },
  authBtn: {
    width: '100%', padding: '12px', background: '#3b82f6',
    color: 'white', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
  },
  error: {
    background: '#450a0a', color: '#ef4444', padding: '10px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '12px',
  },
};

export default App;