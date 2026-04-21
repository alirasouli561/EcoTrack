import { useLocation, useNavigate } from 'react-router-dom';
import './CitizenSignalerSuccess.css';

export default function CitizenSignalerSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ticketNumber = state?.id ? `#SIG-${new Date().getFullYear()}-${String(state.id).padStart(6, '0')}` : '#SIG-NOUVEAU';
  return (
    <div className="signaler-success">
      <div className="success-icon-wrap">
        <div className="success-circle"><i className="fas fa-check"></i></div>
      </div>
      <h2>Signalement envoyé !</h2>
      <p>Votre signalement a bien été transmis aux équipes concernées.</p>
      <div className="success-points-badge">
        <i className="fas fa-star"></i> +10 EcoPoints crédités
      </div>
      <div className="success-ticket">
        <span>Numéro de ticket</span>
        <strong>{ticketNumber}</strong>
      </div>
      <p className="success-delay">Délai de traitement estimé : <strong>24–48h</strong></p>
      <div className="success-actions">
        <button className="sig-btn-primary" onClick={() => navigate('/citoyen')}>
          Retour à l'accueil
        </button>
        <button className="sig-btn-outline" onClick={() => navigate('/citoyen/signalements')}>
          Mes signalements
        </button>
      </div>
    </div>
  );
}
