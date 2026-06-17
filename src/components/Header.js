import logo from '../assets/Logo.svg';
import Nav from './Nav';

function Header({ onNavigate, currentPage }) {
  return (
    <header className="header">
      <button
        className="header-logo-btn"
        aria-label="Little Lemon — go to home page"
        onClick={() => onNavigate('home')}
      >
        <img className="header-logo" src={logo} alt="Little Lemon logo" />
      </button>
      <Nav onNavigate={onNavigate} currentPage={currentPage} />
    </header>
  );
}

export default Header;
