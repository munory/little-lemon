import { useState } from 'react';
import logo from '../assets/Logo.svg';
import Nav from './Nav';
import { useCart } from '../context/CartContext';

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HamburgerIcon({ isOpen }) {
  return isOpen ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function Header({ onNavigate, currentPage }) {
  const { totalItems, openDrawer } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* header-wrapper is sticky so mobile-menu sticks with it */}
      <div className="header-wrapper">
        <header className="header">
          {/* Hamburger — visible only on mobile/tablet */}
          <button
            className="header-hamburger"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <HamburgerIcon isOpen={isMenuOpen} />
          </button>

          {/* Logo */}
          <button
            className="header-logo-btn"
            aria-label="Little Lemon — go to home page"
            onClick={() => handleNavigate('home')}
          >
            <img className="header-logo" src={logo} alt="Little Lemon logo" />
          </button>

          {/* Desktop Nav — hidden on mobile */}
          <div className="header-nav-desktop">
            <Nav onNavigate={handleNavigate} currentPage={currentPage} />
          </div>

          {/* Cart — always visible */}
          <button
            className="cart-btn"
            onClick={openDrawer}
            aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} item${totalItems !== 1 ? 's' : ''}` : ', empty'}`}
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className="cart-badge" aria-hidden="true">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
        </header>

        {/* Mobile dropdown — slides down from inside the sticky wrapper */}
        <div
          id="mobile-menu"
          className={`mobile-menu${isMenuOpen ? ' open' : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <Nav onNavigate={handleNavigate} currentPage={currentPage} />
        </div>
      </div>

      {/* Backdrop behind mobile menu */}
      {isMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          aria-hidden="true"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header;
