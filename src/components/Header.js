import logo from '../assets/Logo.svg';
import Nav from './Nav';

function Header({ onNavigate }) {
  return (
    <header className="header">
      <img className="header-logo" src={logo} alt="Little Lemon logo" />
      <Nav onNavigate={onNavigate} />
    </header>
  );
}

export default Header;
