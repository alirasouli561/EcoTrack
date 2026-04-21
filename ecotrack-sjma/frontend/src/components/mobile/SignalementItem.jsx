import './SignalementItem.css';

const statusColorMap = {
  blue: '#2196F3',
  yellow: '#FFC107',
  green: '#4CAF50',
};

const badgeClassMap = {
  new: 'sig-badge-new',
  progress: 'sig-badge-progress',
  resolved: 'sig-badge-resolved',
};

export default function SignalementItem({ signalement, onClick }) {
  return (
    <div className="mobile-sig-item" onClick={onClick} role="button" tabIndex={0}>
      <div
        className="mobile-sig-bar"
        style={{ background: statusColorMap[signalement.statusColor] || '#ccc' }}
      />
      <div className="mobile-sig-info">
        <strong>#{signalement.id}</strong>
        <span>{signalement.type} - {signalement.adresse}</span>
      </div>
      <span className={`mobile-sig-badge ${badgeClassMap[signalement.statusType] || ''}`}>
        {signalement.status}
      </span>
    </div>
  );
}
