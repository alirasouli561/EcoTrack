import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../../components/mobile/MobileHeader';
import '../mobile/mobile-pages.css';

export default function SignalementForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [problemType, setProblemType] = useState('debordement');
  const [urgency, setUrgency] = useState('Moyenne');

  const steps = [1, 2, 3];

  const handleSubmit = () => {
    navigate('/citoyen/signaler/success');
  };

  return (
    <>
      <MobileHeader title="Nouveau Signalement" onBack={() => navigate('/citoyen')} />
      <div className="mobile-page">
        {/* Stepper */}
        <div className="sig-stepper">
          {steps.map((s, i) => (
            <span key={s} style={{ display: 'contents' }}>
              <div className={`sig-step-dot ${step >= s ? 'active' : ''}`}>{s}</div>
              {i < steps.length - 1 && <div className={`sig-step-line ${step > s ? 'done' : ''}`} />}
            </span>
          ))}
        </div>

        {/* Step 1 - form content */}
        <p className="sig-form-label">Identifier le conteneur</p>
        <div className="sig-scan-options">
          <button className="sig-scan-btn">
            <i className="fas fa-qrcode"></i>
            Scanner QR Code
          </button>
          <button className="sig-scan-btn">
            <i className="fas fa-map-marked-alt"></i>
            Choisir sur la carte
          </button>
        </div>

        <div className="sig-container-selected">
          <i className="fas fa-check-circle"></i>
          <div>
            <strong>CONT-2026-00456</strong>
            <span style={{ display: 'block' }}>15 Rue Victor Hugo — Ordures menageres</span>
          </div>
        </div>

        <p className="sig-form-label">Type de probleme</p>
        <div className="sig-type-options">
          <button
            className={`sig-type-card ${problemType === 'debordement' ? 'active' : ''}`}
            onClick={() => setProblemType('debordement')}
          >
            <i className="fas fa-dumpster-fire"></i>
            Debordement
          </button>
          <button
            className={`sig-type-card ${problemType === 'degradation' ? 'active' : ''}`}
            onClick={() => setProblemType('degradation')}
          >
            <i className="fas fa-tools"></i>
            Degradation
          </button>
        </div>

        <p className="sig-form-label">Photo (optionnel)</p>
        <div className="sig-photo-upload">
          <i className="fas fa-camera"></i>
          <span>Prendre une photo</span>
        </div>

        <p className="sig-form-label">Urgence</p>
        <div className="sig-urgency-selector">
          {['Basse', 'Moyenne', 'Haute'].map((u) => (
            <button
              key={u}
              className={`sig-urgency-btn ${urgency === u ? 'active' : ''}`}
              onClick={() => setUrgency(u)}
            >
              {u}
            </button>
          ))}
        </div>

        <p className="sig-form-label">Description</p>
        <textarea
          className="sig-textarea"
          placeholder="Decrivez le probleme..."
          defaultValue="Le conteneur vert a l'angle de la rue Victor Hugo est plein depuis 3 jours"
        />

        <button className="sig-submit-btn" onClick={handleSubmit}>
          <i className="fas fa-paper-plane"></i>
          Envoyer le signalement (+10 pts)
        </button>
      </div>
    </>
  );
}
