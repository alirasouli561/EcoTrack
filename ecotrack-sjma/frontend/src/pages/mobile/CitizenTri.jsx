import { useEffect, useState } from 'react';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { triCategories } from '../../services/mockData';
import './CitizenTri.css';

// Static waste guide data (no backend endpoint — static is appropriate for a guide)
// triCategories imported from mockData as canonical source of truth

export default function CitizenTri() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Unique color-based filter chips derived from categories
  const FILTERS = [
    { key: 'all', label: 'Tout' },
    { key: 'recyclable', label: '♻️ Recyclable' },
    { key: 'biodechet', label: '🌿 Biodéchets' },
    { key: 'special', label: '⚠️ Spéciaux' },
  ];

  const FILTER_IDS = {
    all: null,
    recyclable: [1, 2, 3],  // Emballages, Verre, Papier
    biodechet: [4],          // Compost
    special: [6],            // Déchets spéciaux
  };

  const filtered = triCategories
    .filter(cat => {
      if (activeFilter !== 'all') {
        const ids = FILTER_IDS[activeFilter];
        if (ids && !ids.includes(cat.id)) return false;
      }
      return true;
    })
    .map(cat => ({
      ...cat,
      items: cat.items.filter(item =>
        !search || item.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat =>
      !search ||
      cat.items.length > 0 ||
      cat.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="tri-page">
      <MobileScreenHeader title="Guide du tri" backTo="/citoyen" />
      <div className="tri-body">
        {/* Search bar */}
        <div className="tri-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Rechercher un déchet..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="tri-clear" onClick={() => setSearch('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="tri-filters">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`tri-chip ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Info banner */}
        <div className="tri-banner">
          <i className="fas fa-info-circle"></i>
          <span>Bien trier réduit les coûts de collecte et préserve l'environnement.</span>
        </div>

        {/* Category cards */}
        <div className="tri-categories">
          {filtered.length === 0 && (
            <div className="tri-empty">
              <i className="fas fa-search"></i>
              <p>Aucun résultat pour «{search}»</p>
            </div>
          )}
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
                <div className="tri-cat-info">
                  <span className="tri-cat-name">{cat.name}</span>
                  <span className="tri-cat-count">{cat.items.length} éléments</span>
                </div>
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

        {/* Tip footer */}
        <div className="tri-tip">
          <i className="fas fa-lightbulb"></i>
          <div>
            <strong>Astuce :</strong> En cas de doute, consultez l'application de votre mairie ou déposez à la déchetterie.
          </div>
        </div>
      </div>
    </div>
  );
}
