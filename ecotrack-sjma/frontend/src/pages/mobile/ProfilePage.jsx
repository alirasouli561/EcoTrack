import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MobileHeader from '../../components/mobile/MobileHeader';
import { citizenUser } from '../../services/mockData';
import '../mobile/mobile-pages.css';

const menuItems = [
  { icon: 'fa-user-edit', label: 'Modifier mes informations', path: '/citoyen/profil/edit' },
  { icon: 'fa-map-marker-alt', label: 'Mon adresse', path: null },
  { icon: 'fa-bell', label: 'Parametres notifications', path: '/citoyen/profil/notifications' },
  { icon: 'fa-list-alt', label: 'Mes signalements', path: '/citoyen/signalements' },
  { icon: 'fa-coins', label: 'Historique des points', path: '/citoyen/points' },
  { icon: 'fa-store', label: 'Boutique recompenses', path: '/citoyen/boutique' },
  { icon: 'fa-chart-bar', label: 'Statistiques publiques', path: '/citoyen/statistiques' },
  { icon: 'fa-calendar-alt', label: 'Horaires de collecte', path: '/citoyen/horaires' },
  { icon: 'fa-info-circle', label: 'A propos', path: null },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = (user?.prenom || citizenUser.prenom) + ' ' + (user?.nom || citizenUser.nom);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <MobileHeader title="Mon Profil" onBack={() => navigate('/citoyen')} />

      <div className="profile-header-section">
        <div className="profile-avatar">
          <i className="fas fa-user"></i>
        </div>
        <h2>{displayName}</h2>
        <p>{user?.email || citizenUser.email}</p>

        <div className="profile-stats-row">
          <div className="profile-stat"><span className="stat-num">{citizenUser.points.toLocaleString()}</span><span className="stat-lbl">Points</span></div>
          <div className="profile-stat"><span className="stat-num">23</span><span className="stat-lbl">Signalements</span></div>
          <div className="profile-stat"><span className="stat-num">3</span><span className="stat-lbl">Badges</span></div>
        </div>
      </div>

      <nav className="profile-menu">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="profile-menu-item"
            onClick={() => item.path && navigate(item.path)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
            <i className="fas fa-chevron-right" style={{ color: '#ccc', fontSize: '0.7rem' }}></i>
          </button>
        ))}
        <button className="profile-menu-item danger" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Deconnexion</span>
        </button>
      </nav>
    </>
  );
}
