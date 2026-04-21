import { useState } from 'react';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { triCategories } from '../../services/mockData';
import './CitizenTri.css';

export default function CitizenTri() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const filtered = triCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => !search || item.toLowerCase().includes(search.toLowerCase())),
  })).filter(cat => !search || cat.items.length > 0 || cat.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="tri-page">
      <MobileScreenHeader title="Guide du tri" backTo="/citoyen" />
      <div className="tri-body">
        <div className="tri-search">
          <i className="fas fa-search"></i>
          <input
            type="text" placeholder="Rechercher un déchet..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="tri-categories">
          {filtered.map(cat => (
            <div key={cat.id} className="tri-cat-card">
              <button
                className="tri-cat-header"
                style={{ borderLeft: `4px solid ${cat.color}` }}
                onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}
              >
                <div className="tri-cat-icon-wrap" style={{ background: cat.color + '22', color: cat.color }}>
                  <i className={`fas ${cat.icon}`}></i>
                </div>
                <span>{cat.name}</span>
                <i className={`fas fa-chevron-${expanded === cat.id ? 'up' : 'down'} tri-chevron`}></i>
              </button>
              {(expanded === cat.id || !!search) && (
                <div className="tri-cat-items">
                  {cat.items.map((item, i) => (
                    <div key={i} className="tri-item">
                      <i className="fas fa-check" style={{ color: cat.color }}></i>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
