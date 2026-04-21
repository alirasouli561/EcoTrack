import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../../components/mobile/MobileHeader';
import { citizenUser } from '../../services/mockData';
import '../mobile/mobile-pages.css';

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: citizenUser.prenom + ' ' + citizenUser.nom,
    email: citizenUser.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    navigate('/citoyen/profil');
  };

  return (
    <>
      <MobileHeader title="Modifier mes infos" onBack={() => navigate('/citoyen/profil')} />
      <div className="mobile-page">
        <div className="edit-profile-avatar">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <button className="change-photo-btn">
            <i className="fas fa-camera"></i> Changer la photo
          </button>
        </div>

        <div className="mobile-form-group">
          <label>Nom d'utilisateur</label>
          <input className="mobile-form-input" name="nom" value={form.nom} onChange={handleChange} />
        </div>

        <div className="mobile-form-group">
          <label>Email</label>
          <input className="mobile-form-input" name="email" type="email" value={form.email} onChange={handleChange} />
        </div>

        <h3 className="form-section-title">Changer le mot de passe</h3>

        <div className="mobile-form-group">
          <label>Mot de passe actuel</label>
          <input className="mobile-form-input" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} placeholder="••••••••" />
        </div>

        <div className="mobile-form-group">
          <label>Nouveau mot de passe</label>
          <input className="mobile-form-input" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="Min. 8 caracteres" />
        </div>

        <div className="mobile-form-group">
          <label>Confirmer le mot de passe</label>
          <input className="mobile-form-input" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" />
        </div>

        <button className="btn-save" onClick={handleSave}>
          <i className="fas fa-save"></i> Enregistrer les modifications
        </button>

        <button className="btn-delete-account">
          <i className="fas fa-trash-alt"></i> Supprimer mon compte
        </button>
      </div>
    </>
  );
}
