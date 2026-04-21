import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenSignaler.css';

// Visual defaults; libellé maps to what's returned by /signalements/types
const TYPE_ICONS = {
  CONTENEUR_PLEIN: 'fa-dumpster-fire',
  CONTENEUR_ENDOMMAGE: 'fa-tools',
  DEPOT_SAUVAGE: 'fa-trash',
  MAUVAISE_ODEUR: 'fa-wind',
  CONTENEUR_INACCESSIBLE: 'fa-ban',
  CONTENEUR_SALE: 'fa-broom',
  CAPTEUR_DEFAILLANT: 'fa-microchip',
};

const URGENCES = ['Basse', 'Moyenne', 'Haute'];

export default function CitizenSignaler() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [step, setStep] = useState(1);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    conteneurId: state?.conteneurUid || '',
    id_conteneur: state?.id_conteneur || null,
    id_type: null,
    urgence: 'Moyenne',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    citizenService.getSignalementTypes()
      .then(t => {
        const list = Array.isArray(t) ? t : (t?.data || []);
        setTypes(list);
      })
      .catch(e => console.error('Failed to load types', e));
  }, []);

  const canNext = () => {
    if (step === 1) return form.conteneurId.trim().length > 0 || form.id_conteneur;
    if (step === 2) return form.id_type != null;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        description: form.description || `Signalement citoyen — ${types.find(t => t.id_type === form.id_type)?.libelle || 'Problème'}`,
        id_type: form.id_type,
      };
      if (form.id_conteneur) payload.id_conteneur = form.id_conteneur;
      else payload.conteneur_uid = form.conteneurId;

      const res = await citizenService.createSignalement(payload);
      const id = res?.id_signalement || res?.data?.id_signalement;
      navigate('/citoyen/signaler/success', { state: { id, payload } });
    } catch (err) {
      console.error('Create signalement failed', err);
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la création';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = types.find(t => t.id_type === form.id_type);

  return (
    <div className="citizen-signaler">
      <MobileScreenHeader title="Nouveau signalement" backTo="/citoyen" />

      <div className="sig-steps">
        {[1, 2, 3].map(s => (
          <div key={s} className="sig-step-item">
            <div className={`sig-step-dot ${s <= step ? 'active' : ''}`}>{s}</div>
            {s < 3 && <div className={`sig-step-line ${s < step ? 'active' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="signaler-body">
        {step === 1 && (
          <div className="step-content">
            <h3>Identifier le conteneur</h3>
            <p className="step-subtitle">Scannez le QR code ou saisissez l'identifiant</p>
            <div className="scan-box">
              <i className="fas fa-qrcode"></i>
              <span>Scanner le QR code</span>
            </div>
            <div className="form-or"><span>ou</span></div>
            <div className="sig-form-group">
              <label>Identifiant du conteneur (ex: CNT-00012)</label>
              <input
                className="sig-input"
                placeholder="CNT-00XXX"
                value={form.conteneurId}
                onChange={e => setForm({ ...form, conteneurId: e.target.value, id_conteneur: null })}
              />
            </div>
            {form.conteneurId && (
              <div className="selected-container">
                <i className="fas fa-check-circle"></i>
                <span>{form.conteneurId}</span>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h3>Décrire le problème</h3>
            <div className="sig-form-group">
              <label>Type de problème</label>
              <div className="type-radio-grid">
                {types.map(t => (
                  <button
                    key={t.id_type}
                    className={`type-radio-card ${form.id_type === t.id_type ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, id_type: t.id_type })}
                  >
                    <i className={`fas ${TYPE_ICONS[t.libelle] || 'fa-exclamation-triangle'}`}></i>
                    <span>{t.libelle.replace(/_/g, ' ').toLowerCase()}</span>
                  </button>
                ))}
                {types.length === 0 && <p style={{ gridColumn: '1/-1', color: '#888' }}>Chargement des types…</p>}
              </div>
            </div>
            <div className="sig-form-group">
              <label>Niveau d'urgence</label>
              <div className="urgence-selector">
                {URGENCES.map(u => (
                  <button
                    key={u}
                    className={`urgence-btn ${form.urgence === u ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, urgence: u })}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="sig-form-group">
              <label>Description (optionnel)</label>
              <textarea
                className="sig-textarea"
                rows={3}
                placeholder="Décrivez le problème..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3>Confirmer le signalement</h3>
            <div className="recap-card">
              <div className="recap-row"><span>Conteneur</span><strong>{form.conteneurId}</strong></div>
              <div className="recap-row"><span>Problème</span><strong>{selectedType?.libelle.replace(/_/g, ' ').toLowerCase() || '-'}</strong></div>
              <div className="recap-row"><span>Urgence</span><strong>{form.urgence}</strong></div>
              {form.description && <div className="recap-row"><span>Description</span><strong>{form.description}</strong></div>}
            </div>
            <div className="recap-points">
              <i className="fas fa-star"></i> +10 EcoPoints seront crédités après validation
            </div>
            {error && <div style={{ color: '#f44336', marginTop: 12, fontSize: '0.85rem' }}>{error}</div>}
          </div>
        )}
      </div>

      <div className="sig-nav-btns">
        {step > 1 && (
          <button className="sig-btn-outline" onClick={() => setStep(s => s - 1)}>
            Précédent
          </button>
        )}
        {step < 3 ? (
          <button className="sig-btn-primary" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
            Suivant
          </button>
        ) : (
          <button className="sig-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner"></span> : <>Envoyer (+10 pts)</>}
          </button>
        )}
      </div>
    </div>
  );
}
