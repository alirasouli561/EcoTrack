import { useNavigate } from 'react-router-dom';
import './MobileHeader.css';

export default function MobileHeader({ title, onBack }) {
  const navigate = useNavigate();

  return (
    <header className="mobile-screen-header">
      <button className="mobile-back-btn" onClick={onBack || (() => navigate(-1))}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <h2>{title}</h2>
      <div className="mobile-header-spacer" />
    </header>
  );
}
