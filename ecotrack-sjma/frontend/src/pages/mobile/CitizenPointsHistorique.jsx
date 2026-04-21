import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenPointsHistorique.css';

const TABS = [
  { key: 'all', label: 'Tout' },
  { key: 'gain', label: 'Gains' },
  { key: 'spend', label: 'Dépenses' },
];

export default function CitizenPointsHistorique() {
  const { user } = useAuth();
  const userId = user?.id || user?.id_utilisateur;

  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({ totalPoints: 0, parJour: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    citizenService.getMyStats(userId)
      .then(data => {
        if (!alive) return;
        setStats(data || { totalPoints: 0, parJour: [] });
      })
      .catch(e => console.error('Failed to load stats', e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [userId]);

  // Build UI history from the per-day series returned by the gamification API
  const history = (stats.parJour || []).map((entry, i) => {
    const points = Number(entry.points) || 0;
    const dateStr = new Date(entry.periode).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    return {
      id: i,
      type: points >= 0 ? 'gain' : 'spend',
      label: points >= 0 ? 'Points gagnés' : 'Points dépensés',
      value: points >= 0 ? `+${points}` : `${points}`,
      date: dateStr,
      icon: points >= 0 ? 'fa-plus-circle' : 'fa-shopping-bag',
      iconBg: points >= 0 ? '#e8f5e9' : '#ffebee',
      iconColor: points >= 0 ? '#4CAF50' : '#f44336',
    };
  });

  const filtered = history.filter(h => activeTab === 'all' || h.type === activeTab);
  const totalGained = history
    .filter(h => h.type === 'gain')
    .reduce((sum, h) => sum + Math.abs(Number(h.value.replace('+', ''))), 0);

  return (
    <div className="points-histo-page">
      <MobileScreenHeader title="Historique des points" backTo="/citoyen/profil" />
      <div className="points-histo-body">
        <div className="points-summary-card">
          <div>
            <span>Solde actuel</span>
            <strong>{(stats.totalPoints || 0).toLocaleString()} pts</strong>
          </div>
          <div className="divider" />
          <div>
            <span>Total gagné</span>
            <strong>{totalGained.toLocaleString()} pts</strong>
          </div>
        </div>

        <div className="histo-tabs">
          {TABS.map(t => (
            <button key={t.key} className={`histo-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="histo-list">
          {loading && <p className="histo-empty">Chargement…</p>}
          {!loading && filtered.map(h => (
            <div key={h.id} className="histo-item">
              <div className="histo-icon" style={{ background: h.iconBg, color: h.iconColor }}>
                <i className={`fas ${h.icon}`}></i>
              </div>
              <div className="histo-info">
                <strong>{h.label}</strong>
                <span>{h.date}</span>
              </div>
              <span className={`histo-value ${h.type === 'gain' ? 'gain' : 'spend'}`}>{h.value}</span>
            </div>
          ))}
          {!loading && filtered.length === 0 && <p className="histo-empty">Aucun historique</p>}
        </div>
      </div>
    </div>
  );
}
