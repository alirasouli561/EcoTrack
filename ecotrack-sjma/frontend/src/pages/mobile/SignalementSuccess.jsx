import { useNavigate } from 'react-router-dom';
import '../mobile/mobile-pages.css';

export default function SignalementSuccess() {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-circle">
        <i className="fas fa-check"></i>
      </div>
      <h2>Signalement envoye !</h2>
      <p>Votre signalement a ete transmis avec succes.</p>
      <div className="success-points">+10 EcoPoints</div>
      <div className="success-ticket">#SIG-2026-001235</div>
      <p style={{ fontSize: '0.8rem', color: '#888' }}>Traitement estime : 24-48 heures</p>
      <div className="success-actions">
        <button className="sig-submit-btn" onClick={() => navigate('/citoyen')}>
          <i className="fas fa-home"></i> Retour a l'accueil
        </button>
        <button className="btn-outline-green" onClick={() => navigate('/citoyen/signalements')}>
          <i className="fas fa-list"></i> Voir mes signalements
        </button>
      </div>
    </div>
  );
}
