import { useNavigate } from 'react-router-dom';
import './MobileScreenHeader.css';

export default function MobileScreenHeader({ title, backTo, onBack, rightAction }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    if (backTo) { navigate(backTo); return; }
    navigate(-1);
  };

  return (
    <header className="mobile-screen-header">
      <button className="mobile-header-back" onClick={handleBack} aria-label="Retour">
        <i className="fas fa-arrow-left"></i>
      </button>
      <h2>{title}</h2>
      <div className="mobile-header-right">
        {rightAction || null}
      </div>
    </header>
  );
}
