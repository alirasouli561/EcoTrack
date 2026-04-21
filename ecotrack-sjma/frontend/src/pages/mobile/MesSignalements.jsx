import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../../components/mobile/MobileHeader';
import { allSignalements } from '../../services/mockData';
import '../mobile/mobile-pages.css';

const badgeClassMap = {
  new: 'sig-badge-new', progress: 'sig-badge-progress', resolved: 'sig-badge-resolved', rejected: 'sig-badge-rejected',
};

const filters = [
  { key: 'all', label: 'Tous', count: 6 },
  { key: 'progress', label: 'En cours', count: 2 },
  { key: 'resolved', label: 'Resolus', count: 2 },
];

export default function MesSignalements() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? allSignalements
    : allSignalements.filter((s) => s.statusType === activeFilter);

  return (
    <>
      <MobileHeader title="Mes Signalements" onBack={() => navigate('/citoyen/profil')} />
      <div className="mobile-page">
        <div className="sig-filter-tabs">
          {filters.map((f) => (
            <button
              key={f.key}
              className={`sig-filter-tab ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label} {f.count}
            </button>
          ))}
        </div>

        {filtered.map((sig) => (
          <div
            key={sig.id}
            className="sig-list-card"
            onClick={() => navigate('/citoyen/signalements/' + sig.id)}
          >
            <div className="sig-list-card-header">
              <strong>#{sig.id}</strong>
              <span className={`mobile-sig-badge ${badgeClassMap[sig.statusType] || ''}`}>{sig.status}</span>
            </div>
            <div className="sig-list-card-body">
              <i className={`fas ${sig.typeIcon || 'fa-exclamation-circle'}`}></i>
              <span>{sig.type} - {sig.adresse}</span>
            </div>
            <div className="sig-list-card-footer">
              <span>{sig.date}</span>
              <span>{sig.conteneur}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
