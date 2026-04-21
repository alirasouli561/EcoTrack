import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenMesSignalements.css';

const TABS = [
  { key: 'tous', label: 'Tous' },
  { key: 'progress', label: 'En cours' },
  { key: 'resolved', label: 'Résolus' },
];

const statusColorMap = { blue: '#2196F3', yellow: '#FFC107', green: '#4CAF50', red: '#f44336' };
const badgeClassMap = { new: 'badge-new', progress: 'badge-progress', resolved: 'badge-resolved', rejected: 'badge-rejected' };

const STATUT_TO_UI = {
  OUVERT: { statusType: 'new', status: 'Nouveau', statusColor: 'blue' },
  EN_COURS: { statusType: 'progress', status: 'En cours', statusColor: 'yellow' },
  RESOLU: { statusType: 'resolved', status: 'Résolu', statusColor: 'green' },
  FERME: { statusType: 'rejected', status: 'Rejeté', statusColor: 'red' },
};

const TYPE_ICONS = {
  CONTENEUR_PLEIN: 'fa-dumpster-fire',
  CONTENEUR_ENDOMMAGE: 'fa-tools',
  DEPOT_SAUVAGE: 'fa-trash',
  MAUVAISE_ODEUR: 'fa-wind',
  CONTENEUR_INACCESSIBLE: 'fa-ban',
  CONTENEUR_SALE: 'fa-broom',
  CAPTEUR_DEFAILLANT: 'fa-microchip',
};

function buildTimeline(s) {
  const ui = STATUT_TO_UI[s.statut] || STATUT_TO_UI.OUVERT;
  return [
    { step: 'Signalement envoyé', done: true },
    { step: 'En cours de traitement', done: ['EN_COURS', 'RESOLU', 'FERME'].includes(s.statut) },
    { step: 'Résolu', done: s.statut === 'RESOLU' },
  ];
}

function adapt(s) {
  const ui = STATUT_TO_UI[s.statut] || STATUT_TO_UI.OUVERT;
  return {
    id: s.id_signalement,
    type: (s.type_signalement || '').replace(/_/g, ' ').toLowerCase() || 'Signalement',
    typeIcon: TYPE_ICONS[s.type_signalement] || 'fa-exclamation-triangle',
    adresse: s.zone_nom || `Conteneur ${s.conteneur_uid || ''}`,
    conteneur: s.conteneur_uid || `#${s.id_conteneur}`,
    date: s.date_creation ? new Date(s.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    description: s.description || '',
    urgence: s.urgence === 'HAUTE' ? 'Haute' : s.urgence === 'BASSE' ? 'Basse' : 'Moyenne',
    timeline: buildTimeline(s),
    agentNote: null,
    ...ui,
  };
}

export default function CitizenMesSignalements() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tous');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    citizenService.getMySignalements({ limit: 50 })
      .then(list => {
        if (!alive) return;
        const arr = Array.isArray(list) ? list : [];
        setItems(arr.map(adapt));
      })
      .catch(e => console.error('Failed to load signalements', e))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const filtered = items.filter(s => activeTab === 'tous' || s.statusType === activeTab);
  const countOf = (key) => key === 'tous' ? items.length : items.filter(s => s.statusType === key).length;

  return (
    <div className="mes-signalements-page">
      <MobileScreenHeader title="Mes signalements" backTo="/citoyen" />

      <div className="mes-sig-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`mes-sig-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
            <span className="tab-count">{countOf(t.key)}</span>
          </button>
        ))}
      </div>

      <div className="mes-sig-list">
        {loading && <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Chargement…</p>}
        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888', padding: 24 }}>Aucun signalement</p>
        )}
        {filtered.map(sig => (
          <div
            key={sig.id}
            className="mes-sig-card"
            onClick={() => navigate(`/citoyen/signalements/${sig.id}`)}
          >
            <div className="mes-sig-card-header">
              <div className="mes-sig-id-row">
                <span className="mes-sig-icon" style={{ background: statusColorMap[sig.statusColor] + '22', color: statusColorMap[sig.statusColor] }}>
                  <i className={`fas ${sig.typeIcon}`}></i>
                </span>
                <div>
                  <strong>#{sig.id}</strong>
                  <span className="mes-sig-type">{sig.type}</span>
                </div>
              </div>
              <span className={`mes-sig-badge ${badgeClassMap[sig.statusType]}`}>{sig.status}</span>
            </div>
            <div className="mes-sig-meta">
              <span><i className="fas fa-map-marker-alt"></i> {sig.adresse}</span>
              <span><i className="fas fa-calendar"></i> {sig.date}</span>
            </div>
            <div className="mes-sig-timeline">
              {sig.timeline.map((step, i) => (
                <div key={i} className={`timeline-step ${step.done ? 'done' : ''}`}>
                  <div className="t-dot" />
                  {i < sig.timeline.length - 1 && <div className="t-line" />}
                  <span>{step.step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
