import { useParams, useNavigate } from 'react-router-dom';
import MobileHeader from '../../components/mobile/MobileHeader';
import { allSignalements } from '../../services/mockData';
import '../mobile/mobile-pages.css';

const badgeClassMap = {
  new: 'sig-badge-new', progress: 'sig-badge-progress', resolved: 'sig-badge-resolved', rejected: 'sig-badge-rejected',
};

export default function SignalementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sig = allSignalements.find((s) => s.id === id) || allSignalements[0];

  return (
    <>
      <MobileHeader title="Detail Signalement" onBack={() => navigate('/citoyen/signalements')} />
      <div className="mobile-page">
        {/* Status bar */}
        <div className="sig-detail-status-bar">
          <span className="sig-detail-id">#{sig.id}</span>
          <span className={`mobile-sig-badge ${badgeClassMap[sig.statusType] || ''}`}>{sig.status}</span>
        </div>

        {/* Timeline */}
        <div className="sig-timeline">
          {sig.timeline.map((t, i) => (
            <span key={t.step} style={{ display: 'contents' }}>
              <div className={`sig-timeline-step ${t.done ? 'done' : ''}`}>
                <div className="sig-timeline-dot" />
                <span className="sig-timeline-label">{t.step}{t.date ? <br /> : ''}{t.date && <small>{t.date}</small>}</span>
              </div>
              {i < sig.timeline.length - 1 && (
                <div className={`sig-timeline-line ${t.done && sig.timeline[i + 1]?.done ? 'done' : ''}`} />
              )}
            </span>
          ))}
        </div>

        {/* Info grid */}
        <div className="sig-detail-section">
          <h4>Informations</h4>
          <div className="sig-detail-grid">
            <div className="sig-detail-item"><label>Type</label><span>{sig.type}</span></div>
            <div className="sig-detail-item"><label>Conteneur</label><span>{sig.conteneur}</span></div>
            <div className="sig-detail-item"><label>Adresse</label><span>{sig.adresse}</span></div>
            <div className="sig-detail-item"><label>Urgence</label><span>{sig.urgence}</span></div>
          </div>
        </div>

        {/* Description */}
        <div className="sig-detail-section">
          <h4>Description</h4>
          <div className="sig-detail-desc">{sig.description}</div>
        </div>

        {/* Agent note */}
        {sig.agentNote && (
          <div className="sig-detail-section">
            <h4>Reponse agent</h4>
            <div className="sig-agent-note">
              <strong><i className="fas fa-user-shield"></i> {sig.agentNote.agent}</strong>
              {sig.agentNote.message}
            </div>
          </div>
        )}

        {/* Action */}
        {sig.statusType !== 'resolved' && sig.statusType !== 'rejected' && (
          <button className="btn-outline-green" style={{ marginTop: 8 }}>
            <i className="fas fa-redo"></i> Relancer le signalement
          </button>
        )}
      </div>
    </>
  );
}
