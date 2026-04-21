import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenSignalementDetail.css';

const badgeClassMap = { new: 'badge-new', progress: 'badge-progress', resolved: 'badge-resolved', rejected: 'badge-rejected' };
const urgenceColors = { Haute: '#f44336', Moyenne: '#FF9800', Basse: '#4CAF50' };

const STATUT_TO_UI = {
  OUVERT: { statusType: 'new', status: 'Nouveau' },
  EN_COURS: { statusType: 'progress', status: 'En cours' },
  RESOLU: { statusType: 'resolved', status: 'Résolu' },
  FERME: { statusType: 'rejected', status: 'Rejeté' },
};

function buildTimeline(statut, history = []) {
  const timeline = [
    { step: 'Signalement envoyé', done: true },
    { step: 'Pris en charge', done: ['EN_COURS', 'RESOLU', 'FERME'].includes(statut) },
    { step: 'En cours de traitement', done: ['EN_COURS', 'RESOLU'].includes(statut) },
    { step: 'Résolu', done: statut === 'RESOLU' },
  ];
  // Enrich with dates from history if available
  if (history && history.length > 0) {
    history.forEach((h) => {
      const d = new Date(h.date_modification || h.date_creation);
      const fmt = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      if (h.nouveau_statut === 'EN_COURS' && timeline[1]) timeline[1].date = fmt;
      if (h.nouveau_statut === 'RESOLU' && timeline[3]) timeline[3].date = fmt;
    });
  }
  return timeline;
}

export default function CitizenSignalementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sig, setSig] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [detail, hist] = await Promise.allSettled([
          citizenService.getSignalementById(id),
          citizenService.getSignalementHistory(id).catch(() => []),
        ]);
        if (!alive) return;
        if (detail.status === 'fulfilled' && detail.value) {
          setSig(detail.value);
        } else {
          setError('Signalement introuvable');
        }
        if (hist.status === 'fulfilled') {
          setHistory(Array.isArray(hist.value) ? hist.value : []);
        }
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="sig-detail-page">
        <MobileScreenHeader title="Signalement" backTo="/citoyen/signalements" />
        <p style={{ textAlign: 'center', padding: 40, color: '#888' }}>Chargement…</p>
      </div>
    );
  }

  if (error || !sig) {
    return (
      <div className="sig-detail-page">
        <MobileScreenHeader title="Signalement" backTo="/citoyen/signalements" />
        <p style={{ textAlign: 'center', padding: 40, color: '#f44336' }}>{error || 'Erreur'}</p>
      </div>
    );
  }

  const ui = STATUT_TO_UI[sig.statut] || STATUT_TO_UI.OUVERT;
  const urgenceLabel = sig.urgence === 'HAUTE' ? 'Haute' : sig.urgence === 'BASSE' ? 'Basse' : 'Moyenne';
  const type = (sig.type_signalement || '').replace(/_/g, ' ').toLowerCase() || 'Signalement';
  const dateStr = sig.date_creation ? new Date(sig.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const timeline = buildTimeline(sig.statut, history);

  return (
    <div className="sig-detail-page">
      <MobileScreenHeader
        title={`#${sig.id_signalement}`}
        backTo="/citoyen/signalements"
        rightAction={<span className={`mes-sig-badge ${badgeClassMap[ui.statusType]}`}>{ui.status}</span>}
      />

      <div className="sig-detail-body">
        <section className="sig-detail-section">
          <h4>Suivi du signalement</h4>
          <div className="sig-full-timeline">
            {timeline.map((step, i) => (
              <div key={i} className={`sig-tl-item ${step.done ? 'done' : ''}`}>
                <div className="sig-tl-left">
                  <div className="sig-tl-dot" />
                  {i < timeline.length - 1 && <div className="sig-tl-line" />}
                </div>
                <div className="sig-tl-content">
                  <strong>{step.step}</strong>
                  {step.date && <span>{step.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="sig-detail-section">
          <h4>Informations</h4>
          <div className="sig-info-grid">
            <div className="sig-info-row"><span>Type</span><strong>{type}</strong></div>
            <div className="sig-info-row"><span>Conteneur</span><strong>{sig.conteneur_uid || `#${sig.id_conteneur}`}</strong></div>
            <div className="sig-info-row"><span>Adresse</span><strong>{sig.zone_nom || '—'}</strong></div>
            <div className="sig-info-row">
              <span>Urgence</span>
              <strong style={{ color: urgenceColors[urgenceLabel] }}>{urgenceLabel}</strong>
            </div>
            <div className="sig-info-row"><span>Date</span><strong>{dateStr}</strong></div>
          </div>
        </section>

        <section className="sig-detail-section">
          <h4>Description</h4>
          <p className="sig-description">{sig.description || '—'}</p>
        </section>

        {sig.url_photo && (
          <section className="sig-detail-section">
            <h4>Photo</h4>
            <img src={sig.url_photo} alt="Signalement" style={{ width: '100%', borderRadius: 10 }} />
          </section>
        )}

        {sig.statut !== 'RESOLU' && sig.statut !== 'FERME' && (
          <button className="sig-relancer-btn" onClick={() => {}}>
            <i className="fas fa-redo"></i> Relancer le signalement
          </button>
        )}
      </div>
    </div>
  );
}
