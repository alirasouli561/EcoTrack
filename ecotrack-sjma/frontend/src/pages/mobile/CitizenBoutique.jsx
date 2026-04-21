import { useEffect, useState } from 'react';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { citizenService } from '../../services/citizenService';
import './CitizenBoutique.css';

export default function CitizenBoutique() {
  const { user } = useAuth();
  const userId = user?.id || user?.id_utilisateur;

  const [points, setPoints] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    // Load reward catalog (static Promise for MVP)
    citizenService.getRewards().then(setCatalog);
  }, []);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    citizenService.getMyStats(userId)
      .then(data => {
        if (!alive) return;
        const pts = data?.totalPoints ?? data?.data?.totalPoints ?? 0;
        setPoints(pts);
      })
      .catch(() => setPoints(0))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [userId]);

  const handleExchange = async (item) => {
    if (points === null || points < item.cost) return;
    setRedeeming(item.id);
    // Optimistic deduction
    setPoints(p => p - item.cost);
    // No real backend endpoint yet — simulate success
    await new Promise(r => setTimeout(r, 600));
    setRedeeming(null);
    setToast(`✅ Échange effectué : ${item.name}`);
    setTimeout(() => setToast(''), 3500);
  };

  return (
    <div className="boutique-page">
      <MobileScreenHeader title="Boutique" backTo="/citoyen/profil" />
      <div className="boutique-body">
        {/* Balance card */}
        <div className="boutique-balance">
          <i className="fas fa-coins"></i>
          <div>
            {loading
              ? <strong>—</strong>
              : <strong>{(points ?? 0).toLocaleString()}</strong>
            }
            <span>EcoPoints disponibles</span>
          </div>
        </div>

        <h3 className="boutique-section-title">Bons &amp; Avantages</h3>
        <div className="boutique-grid">
          {catalog.map(item => {
            const canAfford = points !== null && points >= item.cost;
            const isRedeeming = redeeming === item.id;
            return (
              <div key={item.id} className={`boutique-card ${!canAfford ? 'unavailable' : ''}`}>
                <div className="boutique-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="boutique-info">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  <span className="boutique-cost">
                    <i className="fas fa-coins"></i> {item.cost.toLocaleString()} pts
                  </span>
                </div>
                <button
                  className={`boutique-btn ${!canAfford ? 'insufficient' : ''}`}
                  onClick={() => handleExchange(item)}
                  disabled={!canAfford || isRedeeming || loading}
                >
                  {isRedeeming
                    ? <span className="spinner"></span>
                    : canAfford ? 'Échanger' : 'Insuffisant'
                  }
                </button>
              </div>
            );
          })}
        </div>

        {/* Classement section */}
        <ClassementWidget userId={userId} />
      </div>

      {toast && (
        <div className="boutique-toast">
          {toast}
        </div>
      )}
    </div>
  );
}

// Mini leaderboard using real /api/gamification/classement
function ClassementWidget({ userId }) {
  const [classement, setClassement] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    citizenService.getClassement()
      .then(data => {
        if (!alive) return;
        const arr = Array.isArray(data) ? data : (data?.data || []);
        setClassement(arr.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  if (!loading && classement.length === 0) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 className="boutique-section-title">🏆 Classement EcoPoints</h3>
      {loading
        ? <p style={{ textAlign: 'center', color: '#888', padding: 12 }}>Chargement…</p>
        : (
          <div className="classement-list">
            {classement.map((entry, i) => {
              const isSelf = entry.id_utilisateur === userId || entry.id === userId;
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={entry.id_utilisateur || i} className={`classement-item ${isSelf ? 'self' : ''}`}>
                  <span className="classement-rank">{medals[i] || `#${i + 1}`}</span>
                  <span className="classement-name">
                    {entry.prenom || entry.nom || 'Citoyen'} {entry.nom ? entry.nom[0] + '.' : ''}
                    {isSelf ? ' (vous)' : ''}
                  </span>
                  <span className="classement-pts">{(entry.points || entry.total_points || 0).toLocaleString()} pts</span>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}
