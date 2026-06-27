import React, { useState, useEffect } from 'react';
import { getNotifications, markRead, clearNotifications } from '../api';

const Notifications = ({ userId }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    if (userId) {
      getNotifications(userId)
        .then(res => setNotifs(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => { fetchNotifs(); }, [userId]);

  const handleMarkRead = async (id) => {
    await markRead(id);
    fetchNotifs();
  };

  const handleClear = async () => {
    await clearNotifications(userId);
    fetchNotifs();
  };

  const getIcon = (type) => {
    if (type === 'danger') return '🚨';
    if (type === 'warning') return '⚠️';
    return '✅';
  };

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>Notifications</h2>
        {notifs.length > 0 && (
          <button style={styles.clearBtn} onClick={handleClear}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {loading ? (
        <div style={styles.empty}>Loading...</div>
      ) : notifs.length === 0 ? (
        <div style={styles.emptyBox}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
          <div style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: '600' }}>No notifications</div>
          <div style={{ color: '#64748b', fontSize: '14px', marginTop: '8px' }}>
            Fraud alerts will appear here
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {notifs.map(notif => (
            <div
              key={notif.id}
              style={{
                ...styles.notifCard,
                opacity: notif.is_read ? 0.6 : 1,
                borderLeft: `4px solid ${notif.type === 'danger' ? '#ef4444' : notif.type === 'warning' ? '#f59e0b' : '#22c55e'}`,
              }}
            >
              <div style={styles.notifIcon}>{getIcon(notif.type)}</div>
              <div style={styles.notifBody}>
                <div style={styles.notifTitle}>{notif.title}</div>
                <div style={styles.notifMsg}>{notif.message}</div>
                <div style={styles.notifTime}>
                  {new Date(notif.created_at).toLocaleString()}
                </div>
              </div>
              {!notif.is_read && (
                <button style={styles.readBtn} onClick={() => handleMarkRead(notif.id)}>
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  heading: { color: '#f1f5f9', fontSize: '22px', fontWeight: '600' },
  clearBtn: {
    padding: '8px 16px', background: '#450a0a', color: '#ef4444',
    border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
  },
  empty: { color: '#64748b', textAlign: 'center', padding: '60px 0' },
  emptyBox: {
    background: '#1e293b', borderRadius: '12px', padding: '60px',
    textAlign: 'center', border: '1px solid #334155',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  notifCard: {
    background: '#1e293b', borderRadius: '12px', padding: '16px 20px',
    border: '1px solid #334155', display: 'flex',
    alignItems: 'flex-start', gap: '16px',
  },
  notifIcon: { fontSize: '24px', flexShrink: 0 },
  notifBody: { flex: 1 },
  notifTitle: { color: '#f1f5f9', fontSize: '14px', fontWeight: '600', marginBottom: '4px' },
  notifMsg: { color: '#94a3b8', fontSize: '13px', marginBottom: '8px' },
  notifTime: { color: '#64748b', fontSize: '11px' },
  readBtn: {
    padding: '6px 12px', background: '#1e3a5f', color: '#3b82f6',
    border: '1px solid #3b82f6', borderRadius: '6px',
    cursor: 'pointer', fontSize: '12px', flexShrink: 0,
  },
};

export default Notifications;