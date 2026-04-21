import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenProfil.css';

const MENU_ITEMS = [
  { icon: 'fa-user-edit', label: 'Modifier mes informations', path: '/citoyen/profil/modifier' },
  { icon: 'fa-flag', label: 'Mes signalements', path: '/citoyen/signalements' },
  { icon: 'fa-history', label: 'Historique des points', path: '/citoyen/points-historique' },
  { icon: 'fa-store', label: 'Boutique récompenses', path: '/citoyen/boutique' },
  { icon: 'fa-trophy', label: 'Défis & badges', path: '/citoyen/defis' },
  { icon: 'fa-recycle', label: 'Guide du tri', path: '/citoyen/tri' },
];

export default function CitizenProfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userId = user?.id || user?.id_utilisateur;

  const [profile, setProfile] = useState(user);
  const [stats, setStats] = useState({ points: user?.points ?? 0, badges: 0, signalements: 0 });

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    Promise.allSettled([
      citizenService.getProfileWithStats(),
      citizenService.getMySignalements({ limit: 100 }),
    ]).then(([profR, sigR]) => {
      if (!alive) return;
      if (profR.status === 'fulfilled' && profR.value) {
        setProfile(profR.value);
        setStats(s => ({
          ...s,
          points: profR.value.points ?? s.points,
          badges: parseInt(profR.value.badge_count, 10) || 0,
        }));
      }
      if (sigR.status === 'fulfilled') {
        const arr = Array.isArray(sigR.value) ? sigR.value : [];
        setStats(s => ({ ...s, signalements: arr.length }));
      }
    });
    return () => { alive = false; };
  }, [userId]);

  const displayName = profile ? `${profile.prenom || ''} ${profile.nom || ''}`.trim() : 'Citoyen';
  const email = profile?.email || '';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="profil-page">
      <MobileScreenHeader title="Mon profil" backTo="/citoyen" />

      <div className="profil-body">
        <div className="profil-hero">
          <div className="profil-avatar"><i className="fas fa-user"></i></div>
          <h2>{displayName || 'Citoyen'}</h2>
          <p>{email}</p>
          <div className="profil-stats-row">
            <div className="profil-stat"><strong>{(stats.points || 0).toLocaleString()}</strong><span>Points</span></div>
            <div className="profil-stat-divider" />
            <div className="profil-stat"><strong>{stats.signalements}</strong><span>Signalements</span></div>
            <div className="profil-stat-divider" />
            <div className="profil-stat"><strong>{stats.badges}</strong><span>Badges</span></div>
          </div>
        </div>

        <div className="profil-menu">
          {MENU_ITEMS.map(item => (
            <button key={item.path} className="profil-menu-item" onClick={() => navigate(item.path)}>
              <span className="menu-icon"><i className={`fas ${item.icon}`}></i></span>
              <span className="menu-label">{item.label}</span>
              <i className="fas fa-chevron-right menu-arrow"></i>
            </button>
          ))}

          <button className="profil-menu-item danger" onClick={handleLogout}>
            <span className="menu-icon danger"><i className="fas fa-sign-out-alt"></i></span>
            <span className="menu-label">Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );
}
