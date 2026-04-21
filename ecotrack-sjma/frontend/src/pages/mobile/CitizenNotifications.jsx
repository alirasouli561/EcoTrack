import { useEffect, useState } from 'react';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenNotifications.css';

// Map backend type to UI icon + colors
const TYPE_STYLE = {
  ALERTE:       { icon: 'fa-exclamation-circle', bg: '#ffebee', color: '#f44336' },
  INFO:         { icon: 'fa-info-circle',        bg: '#e3f2fd', color: '#2196F3' },
  COLLECTE:     { icon: 'fa-truck',              bg: '#e8f5e9', color: '#4CAF50' },
  POINTS:       { icon: 'fa-star',               bg: '#fff8e1', color: '#FF9800' },
  DEFI:         { icon: 'fa-trophy',             bg: '#f3e5f5', color: '#9C27B0' },
  SIGNALEMENT:  { icon: 'fa-flag',               bg: '#e1f5fe', color: '#03A9F4' },
};

function relativeDate(d) {
  if (!d) return '';
  const date = new Date(d);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function CitizenNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    citizenService.getNotifications()
      .then(data => {
        if (!alive) return;
        const arr = Array.isArray(data) ? data : (data?.data || []);
        setItems(arr);
      })
      .catch(e => console.error('Failed to load notifications', e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const markAllRead = async () => {
    const unread = items.filter(n => !n.est_lu);
    setItems(items.map(n => ({ ...n, est_lu: true })));
    await Promise.allSettled(unread.map(n => citizenService.markNotificationRead(n.id_notification).catch(() => null)));
  };
  const markRead = async (id) => {
    setItems(items.map(n => n.id_notification === id ? { ...n, est_lu: true } : n));
    try { await citizenService.markNotificationRead(id); } catch {}
  };
  const unreadCount = items.filter(n => !n.est_lu).length;

  return (
    <div className="notifications-page">
      <MobileScreenHeader
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
        backTo="/citoyen"
        rightAction={
          unreadCount > 0 ? (
            <button className="mark-all-btn" onClick={markAllRead}>
              <i className="fas fa-check-double"></i>
            </button>
          ) : null
        }
      />
      <div className="notif-list">
        {loading && <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Chargement…</p>}
        {!loading && items.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Aucune notification</p>
        )}
        {items.map(notif => {
          const style = TYPE_STYLE[notif.type] || TYPE_STYLE.INFO;
          return (
            <div key={notif.id_notification} className={`notif-item ${!notif.est_lu ? 'unread' : ''}`} onClick={() => markRead(notif.id_notification)}>
              <div className="notif-icon-wrap" style={{ background: style.bg }}>
                <i className={`fas ${style.icon}`} style={{ color: style.color }}></i>
              </div>
              <div className="notif-content">
                <strong>{notif.titre}</strong>
                <p>{notif.corps}</p>
                <span>{relativeDate(notif.date_creation)}</span>
              </div>
              {!notif.est_lu && <div className="notif-unread-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
