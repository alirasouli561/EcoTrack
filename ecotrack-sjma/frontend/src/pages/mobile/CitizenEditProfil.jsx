import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MobileScreenHeader from '../../components/mobile/MobileScreenHeader';
import { citizenService } from '../../services/citizenService';
import './CitizenEditProfil.css';

export default function CitizenEditProfil() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);

    try {
      // Update profile fields if they changed
      const profileData = {};
      if (form.prenom && form.prenom !== user?.prenom) profileData.prenom = form.prenom;
      if (form.nom && form.nom !== user?.nom) profileData.nom = form.nom;
      if (form.email && form.email !== user?.email) profileData.email = form.email;

      if (Object.keys(profileData).length > 0) {
        await citizenService.updateProfile(profileData);
      }

      // Change password if requested
      if (form.newPassword) {
        if (form.newPassword !== form.confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        if (!form.oldPassword) {
          throw new Error('Mot de passe actuel requis');
        }
        await citizenService.changePassword({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        });
      }

      setSaved(true);
      setForm(f => ({ ...f, oldPassword: '', newPassword: '', confirmPassword: '' }));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de l\'enregistrement';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profil-page">
      <MobileScreenHeader title="Modifier mon profil" backTo="/citoyen/profil" />
      <div className="edit-profil-body">
        <div className="edit-avatar-section">
          <div className="edit-avatar"><i className="fas fa-user"></i></div>
          <button className="change-photo-btn"><i className="fas fa-camera"></i> Changer la photo</button>
        </div>

        <form onSubmit={handleSave} className="edit-profil-form">
          <div className="edit-section-title">Informations personnelles</div>
          <div className="edit-form-group">
            <label>Prénom</label>
            <input className="edit-input" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} />
          </div>
          <div className="edit-form-group">
            <label>Nom</label>
            <input className="edit-input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div className="edit-form-group">
            <label>Email</label>
            <input className="edit-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div className="edit-section-title" style={{ marginTop: 8 }}>Changer le mot de passe</div>
          <div className="edit-form-group">
            <label>Mot de passe actuel</label>
            <input className="edit-input" type="password" placeholder="••••••••" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} />
          </div>
          <div className="edit-form-group">
            <label>Nouveau mot de passe</label>
            <input className="edit-input" type="password" placeholder="••••••••" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div className="edit-form-group">
            <label>Confirmer le mot de passe</label>
            <input className="edit-input" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>

          {error && <div style={{ color: '#f44336', fontSize: '0.85rem', marginBottom: 12 }}>{error}</div>}
          {saved && <div className="edit-success-banner"><i className="fas fa-check-circle"></i> Profil mis à jour !</div>}

          <button type="submit" className="edit-save-btn" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
