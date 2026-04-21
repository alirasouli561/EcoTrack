import { useState } from 'react';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { boutique, citizenUser } from '../../services/mockData';
import './CitizenBoutique.css';

export default function CitizenBoutique() {
  const [toast, setToast] = useState('');

  const handleExchange = (item) => {
    if (!item.available) return;
    setToast(`Échange effectué : ${item.name} !`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="boutique-page">
      <MobileScreenHeader title="Boutique" backTo="/citoyen/profil" />
      <div className="boutique-body">
        <div className="boutique-balance">
          <i className="fas fa-coins"></i>
          <div>
            <strong>{citizenUser.points.toLocaleString()}</strong>
            <span>EcoPoints disponibles</span>
          </div>
        </div>

        <h3 className="boutique-section-title">Bons & Avantages</h3>
        <div className="boutique-grid">
          {boutique.map(item => (
            <div key={item.id} className={`boutique-card ${!item.available ? 'unavailable' : ''}`}>
              <div className="boutique-icon" style={{ background: item.iconBg, color: item.iconColor }}>
                <i className={`fas ${item.icon}`}></i>
              </div>
              <div className="boutique-info">
                <strong>{item.name}</strong>
                <p>{item.description}</p>
                <span className="boutique-cost"><i className="fas fa-coins"></i> {item.cost} pts</span>
              </div>
              <button
                className={`boutique-btn ${!item.available ? 'insufficient' : ''}`}
                onClick={() => handleExchange(item)}
                disabled={!item.available}
              >
                {item.available ? 'Échanger' : 'Insuffisant'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="boutique-toast">
          <i className="fas fa-check-circle"></i> {toast}
        </div>
      )}
    </div>
  );
}
