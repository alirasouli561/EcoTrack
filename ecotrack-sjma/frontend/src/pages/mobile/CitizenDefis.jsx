import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenDefis.css';

const TABS = ['Défis actifs', 'Mes badges'];

const BADGE_STYLES = {
  FIRST_REPORT:   { icon: 'fa-medal', color: '#4CAF50' },
  ECO_STARTER:    { icon: 'fa-leaf', color: '#8BC34A' },
  ECO_WARRIOR:    { icon: 'fa-shield-alt', color: '#2196F3' },
  ECO_HERO:       { icon: 'fa-award', color: '#FF9800' },
  ECO_LEGEND:     { icon: 'fa-crown', color: '#9C27B0' },
  WEEK_STREAK:    { icon: 'fa-fire', color: '#f44336' },
  MONTH_STREAK:   { icon: 'fa-calendar-check', color: '#795548' },
};

function defiTag(d) {
  const now = new Date();
  const fin = d.date_fin ? new Date(d.date_fin) : null;
  if (!fin) return { tagClass: 'monthly', label: 'Défi' };
  const days = (fin - now) / (1000 * 60 * 60 * 24);
  if (days <= 2) return { tagClass: 'daily', label: 'Quotidien' };
  if (days <= 7) return { tagClass: 'weekly', label: 'Hebdo' };
  return { tagClass: 'monthly', label: 'Mensuel' };
}

const tagColors = { daily: '#e3f2fd', weekly: '#f3e5f5', monthly: '#fff3e0' };
const tagTextColors = { daily: '#1565C0', weekly: '#7B1FA2', monthly: '#e65100' };

export default function CitizenDefis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id || user?.id_utilisateur;

  const [activeTab, setActiveTab] = useState(0);
  const [defis, setDefis] = useState([]);
  const [badges, setBadges] = useState([]);
  const [myBadgeIds, setMyBadgeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const results = await Promise.allSettled([
        citizenService.getDefis(),
        citizenService.getBadges(),
        userId ? citizenService.getMyBadges(userId) : Promise.resolve([]),
      ]);
      if (!alive) return;
      const [defisR, badgesR, myBadgesR] = results;
      if (defisR.status === 'fulfilled') {
        const arr = Array.isArray(defisR.value) ? defisR.value : (defisR.value?.data || []);
        setDefis(arr);
      }
      if (badgesR.status === 'fulfilled') {
        const arr = Array.isArray(badgesR.value) ? badgesR.value : (badgesR.value?.data || []);
        setBadges(arr);
      }
      if (myBadgesR.status === 'fulfilled') {
        const arr = Array.isArray(myBadgesR.value) ? myBadgesR.value : (myBadgesR.value?.data || []);
        setMyBadgeIds(new Set(arr.map(b => b.id_badge)));
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [userId]);

  return (
    <div className="defis-page">
      <MobileScreenHeader
        title="Défis & Badges"
        backTo="/citoyen"
        rightAction={
          <button className="defis-boutique-btn" onClick={() => navigate('/citoyen/boutique')}>
            <i className="fas fa-store"></i>
          </button>
        }
      />

      <div className="defis-tabs">
        {TABS.map((t, i) => (
          <button key={i} className={`defis-tab ${activeTab === i ? 'active' : ''}`} onClick={() => setActiveTab(i)}>
            {t}
          </button>
        ))}
      </div>

      <div className="defis-body">
        {loading && <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Chargement…</p>}

        {!loading && activeTab === 0 && (
          <div className="defis-list">
            {defis.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Aucun défi en cours</p>}
            {defis.map(d => {
              const tag = defiTag(d);
              const progress = d.ma_progression ?? 0;
              const total = d.objectif || 1;
              return (
                <div key={d.id_defi} className="defi-card">
                  <div className="defi-card-header">
                    <span className="defi-tag" style={{ background: tagColors[tag.tagClass], color: tagTextColors[tag.tagClass] }}>
                      {tag.label}
                    </span>
                    <span className="defi-reward"><i className="fas fa-star"></i> {d.recompense_points}</span>
                  </div>
                  <h4>{d.titre}</h4>
                  <p>{d.description}</p>
                  <div className="defi-progress-row">
                    <div className="defi-progress-bar">
                      <div className="defi-progress-fill" style={{ width: `${Math.min(100, (progress / total) * 100)}%` }} />
                    </div>
                    <span className="defi-progress-label">{progress}/{total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && activeTab === 1 && (
          <div className="badges-grid">
            {badges.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>Aucun badge disponible</p>}
            {badges.map(b => {
              const earned = myBadgeIds.has(b.id_badge);
              const style = BADGE_STYLES[b.code] || { icon: 'fa-star', color: '#4CAF50' };
              return (
                <div key={b.id_badge} className={`badge-item ${!earned ? 'locked' : ''}`}>
                  <div className="badge-icon-circle" style={{ background: earned ? style.color : '#e0e0e0' }}>
                    <i className={`fas ${style.icon}`} style={{ color: '#fff' }}></i>
                  </div>
                  <span className="badge-name">{b.nom}</span>
                  <span className="badge-pts">{b.points_requis ? `${b.points_requis} pts` : b.description}</span>
                  {!earned && <span className="badge-locked"><i className="fas fa-lock"></i></span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
