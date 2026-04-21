import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { citizenService } from '../../services/citizenService';
import PointsCard from '../../components/mobile/PointsCard';
import QuickActions from '../../components/mobile/QuickActions';
import CollecteCard from '../../components/mobile/CollecteCard';
import ImpactStats from '../../components/mobile/ImpactStats';
import SignalementItem from '../../components/mobile/SignalementItem';
import {
  prochainescollectes,
  quickActions,
} from '../../services/mockData';
import './CitizenHome.css';

// Helpers to adapt backend shapes to the UI components
const mapStatusForUI = (s) => {
  if (!s) return { status: 'Nouveau', statusType: 'new', statusColor: 'blue' };
  const up = String(s).toUpperCase();
  if (up === 'RESOLU') return { status: 'Résolu', statusType: 'resolved', statusColor: 'green' };
  if (up === 'EN_COURS') return { status: 'En cours', statusType: 'progress', statusColor: 'yellow' };
  if (up === 'REJETE') return { status: 'Rejeté', statusType: 'resolved', statusColor: 'red' };
  return { status: 'Nouveau', statusType: 'new', statusColor: 'blue' };
};

const computeLevel = (points) => {
  if (points >= 5000) return { niveau: 'Éco-Légende', niveauSuivant: 'Maître', pointsNiveauSuivant: 10000 };
  if (points >= 1000) return { niveau: 'Éco-Héros (Or)', niveauSuivant: 'Éco-Légende', pointsNiveauSuivant: 5000 };
  if (points >= 500)  return { niveau: 'Éco-Acteur (Argent)', niveauSuivant: 'Éco-Héros', pointsNiveauSuivant: 1000 };
  if (points >= 100)  return { niveau: 'Éco-Starter', niveauSuivant: 'Éco-Acteur', pointsNiveauSuivant: 500 };
  return { niveau: 'Nouveau', niveauSuivant: 'Éco-Starter', pointsNiveauSuivant: 100 };
};

export default function CitizenHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [points, setPoints] = useState(user?.points ?? 0);
  const [stats, setStats] = useState(null);
  const [recentSignalements, setRecentSignalements] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const userId = user?.id || user?.id_utilisateur;
  const displayName = user?.prenom || user?.nom || 'Citoyen';

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const results = await Promise.allSettled([
          citizenService.getProfileWithStats(),
          userId ? citizenService.getMyStats(userId) : Promise.resolve(null),
          citizenService.getMySignalements({ limit: 3 }),
          citizenService.getNotifications().catch(() => ({ data: [] })),
        ]);
        if (!alive) return;

        const [profileR, statsR, signalR, notifR] = results;
        if (profileR.status === 'fulfilled' && profileR.value) {
          setPoints(profileR.value.points ?? 0);
        }
        if (statsR.status === 'fulfilled' && statsR.value) {
          setStats(statsR.value);
          if (typeof statsR.value.totalPoints === 'number') {
            setPoints(statsR.value.totalPoints);
          }
        }
        if (signalR.status === 'fulfilled') {
          const list = Array.isArray(signalR.value) ? signalR.value : [];
          setRecentSignalements(list.slice(0, 3));
        }
        if (notifR.status === 'fulfilled') {
          const arr = Array.isArray(notifR.value) ? notifR.value : (notifR.value?.data || []);
          setUnreadCount(arr.filter((n) => !n.est_lu).length);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [userId]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const level = computeLevel(points);
  const progression = Math.min(100, Math.round((points / level.pointsNiveauSuivant) * 100));

  const impactStats = [
    { id: 1, icon: 'fa-cloud', color: '#4CAF50', value: `${stats?.impactCO2 ?? 0} kg`, label: 'CO2 évité' },
    { id: 2, icon: 'fa-dumpster', color: '#FF9800', value: `${Math.max(0, Math.round((stats?.totalPoints ?? points) / 30))} kg`, label: 'Déchets triés' },
    { id: 3, icon: 'fa-flag', color: '#2196F3', value: String(recentSignalements.length || 0), label: 'Signalements' },
  ];

  const adaptedSignalements = recentSignalements.map((s) => {
    const ui = mapStatusForUI(s.statut);
    return {
      id: s.id_signalement,
      type: s.type_signalement || s.description?.slice(0, 30) || 'Signalement',
      adresse: s.zone_nom || `Conteneur ${s.conteneur_uid || ''}`,
      date: s.date_creation ? new Date(s.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
      ...ui,
    };
  });

  return (
    <div className="citizen-home">
      <header className="citizen-header">
        <div className="citizen-greeting">
          <h1>Bonjour, {displayName} <span role="img" aria-label="wave">&#128075;</span></h1>
          <p>{capitalizedDate}</p>
        </div>
        <div className="citizen-header-actions">
          <button className="header-icon-btn" onClick={() => navigate('/citoyen/notifications')}>
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>
          <button className="header-icon-btn" onClick={() => navigate('/citoyen/profil')}>
            <i className="fas fa-user-circle"></i>
          </button>
        </div>
      </header>

      <PointsCard
        points={points}
        niveau={level.niveau}
        progression={progression}
        pointsRestants={Math.max(0, level.pointsNiveauSuivant - points)}
        niveauSuivant={level.niveauSuivant}
      />

      <QuickActions actions={quickActions} />

      <section className="citizen-section">
        <h3 className="section-heading">Prochaine collecte</h3>
        {prochainescollectes.map((c) => (
          <CollecteCard key={c.id} collecte={c} />
        ))}
      </section>

      <section className="citizen-section">
        <h3 className="section-heading">Mon impact environnemental</h3>
        <ImpactStats stats={impactStats} />
      </section>

      <section className="citizen-section">
        <h3 className="section-heading">Mes signalements récents</h3>
        {loading && <p className="citizen-empty">Chargement…</p>}
        {!loading && adaptedSignalements.length === 0 && (
          <p className="citizen-empty">Aucun signalement pour le moment</p>
        )}
        {adaptedSignalements.map((sig) => (
          <SignalementItem
            key={sig.id}
            signalement={sig}
            onClick={() => navigate('/citoyen/signalements/' + sig.id)}
          />
        ))}
      </section>
    </div>
  );
}
