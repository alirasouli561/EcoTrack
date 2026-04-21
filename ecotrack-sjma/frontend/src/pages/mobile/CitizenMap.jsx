import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { citizenService } from '../../services/citizenService';
import './CitizenMap.css';

// Fix Leaflet default icon
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Map backend status/capacity to a "fill percent" used for coloring
function containerFill(c) {
  if (c.taux_remplissage != null) return Math.round(Number(c.taux_remplissage));
  if (c.statut === 'PLEIN') return 95;
  if (c.statut === 'MAINTENANCE') return 50;
  if (c.statut === 'INACTIF') return 10;
  // If only capacity is known, pick a pseudo-random but stable fill based on id
  return (Math.abs((c.id_conteneur || 0) * 37) % 100);
}

function fillColor(fill) {
  if (fill >= 71) return '#f44336';
  if (fill >= 31) return '#FF9800';
  return '#4CAF50';
}

const TYPE_LABEL = {
  1: 'Ordures',
  2: 'Recyclage',
  3: 'Verre',
  4: 'Compost',
};

export default function CitizenMap() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [containers, setContainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await citizenService.getContainers({ limit: 200 });
        if (!alive) return;
        const list = Array.isArray(data) ? data : (data?.data || []);
        setContainers(list);
      } catch (e) {
        console.error('Failed to load containers:', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    const map = L.map(mapRef.current, { center: [48.8566, 2.3522], zoom: 12, zoomControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstance.current = map;
    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Render markers whenever containers change
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    const layers = [];
    containers.forEach(c => {
      if (c.latitude == null || c.longitude == null) return;
      const fill = containerFill(c);
      const circle = L.circleMarker([c.latitude, c.longitude], {
        radius: 9, color: '#fff', weight: 2,
        fillColor: fillColor(fill), fillOpacity: 0.9
      }).addTo(map);
      circle.on('click', () => setSelected({
        id: c.id_conteneur,
        label: c.uid || `#${c.id_conteneur}`,
        fill,
        type: TYPE_LABEL[c.id_type] || 'Conteneur',
        capacite: c.capacite_l,
      }));
      layers.push(circle);
    });

    // Fit bounds to visible containers
    if (layers.length > 0) {
      try {
        const group = L.featureGroup(layers);
        map.fitBounds(group.getBounds().pad(0.1));
      } catch {}
    }

    return () => layers.forEach(l => map.removeLayer(l));
  }, [containers]);

  return (
    <div className="citizen-map-page">
      <div className="map-top-bar">
        <button className="map-back-btn" onClick={() => navigate('/citoyen')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="map-search-input">
          <i className="fas fa-search"></i>
          <input
            type="text" placeholder="Rechercher une adresse..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="map-filter-btn" onClick={() => {}}>
          <i className="fas fa-sliders-h"></i>
        </button>
      </div>

      <div ref={mapRef} className="citizen-leaflet-map" />

      <div className="map-legend">
        <span><span className="legend-dot" style={{ background: '#4CAF50' }} /> 0–30%</span>
        <span><span className="legend-dot" style={{ background: '#FF9800' }} /> 31–70%</span>
        <span><span className="legend-dot" style={{ background: '#f44336' }} /> 71–100%</span>
        {loading && <span style={{ marginLeft: 'auto', color: '#888' }}>Chargement…</span>}
      </div>

      {selected && (
        <div className="map-popup-card">
          <div className="map-popup-header">
            <div>
              <strong>{selected.label}</strong>
              <span className="popup-type">{selected.type}</span>
            </div>
            <div className="popup-fill-badge" style={{ background: fillColor(selected.fill) + '22', color: fillColor(selected.fill) }}>
              {selected.fill}% plein
            </div>
            <button className="popup-close" onClick={() => setSelected(null)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="map-popup-body">
            <div className="popup-progress-bar">
              <div className="popup-progress-fill" style={{ width: selected.fill + '%', background: fillColor(selected.fill) }} />
            </div>
            <button className="popup-signaler-btn" onClick={() => navigate('/citoyen/signaler', { state: { conteneurUid: selected.label, id_conteneur: selected.id } })}>
              <i className="fas fa-exclamation-triangle"></i> Signaler un problème
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
