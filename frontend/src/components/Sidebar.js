import React from 'react';

const Sidebar = ({ active, setActive, user }) => {
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'analyzer', icon: '🔍', label: 'Analyze Transaction' },
    { id: 'history', icon: '🕐', label: 'History' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🛡️</div>
        <div>
          <div style={styles.logoText}>UPI Fraud Shield</div>
          <div style={styles.logoSub}>v2.0 Hackathon</div>
        </div>
      </div>

      <nav>
        {navItems.map(item => (
          <div
            key={item.id}
            style={{
              ...styles.navItem,
              ...(active === item.id ? styles.navActive : {})
            }}
            onClick={() => setActive(item.id)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={styles.userBox}>
        <div style={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <div style={styles.userName}>{user?.name || 'User'}</div>
          <div style={styles.userEmail}>{user?.email || ''}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '240px', minWidth: '240px', height: '100vh',
    background: '#0f172a', display: 'flex',
    flexDirection: 'column', padding: '0',
    borderRight: '1px solid #1e293b',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '24px 20px', borderBottom: '1px solid #1e293b',
  },
  logoIcon: { fontSize: '28px' },
  logoText: { color: '#f1f5f9', fontWeight: '600', fontSize: '15px' },
  logoSub: { color: '#64748b', fontSize: '11px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px 20px', color: '#94a3b8', cursor: 'pointer',
    fontSize: '14px', borderLeft: '3px solid transparent',
    transition: 'all 0.2s',
  },
  navActive: {
    color: '#3b82f6', background: '#1e293b',
    borderLeft: '3px solid #3b82f6',
  },
  navIcon: { fontSize: '18px' },
  userBox: {
    marginTop: 'auto', padding: '20px',
    borderTop: '1px solid #1e293b',
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%',
    background: '#3b82f6', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '600', fontSize: '16px', flexShrink: 0,
  },
  userName: { color: '#f1f5f9', fontSize: '13px', fontWeight: '500' },
  userEmail: { color: '#64748b', fontSize: '11px' },
};

export default Sidebar;