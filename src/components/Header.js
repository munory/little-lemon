import { useState, useEffect, useCallback } from 'react';
import logo from '../assets/Logo.svg';
import LoginModal from './LoginModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/* ── Icons ── */
function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

/* ── Desktop-only avatar + dropdown ── */
function UserMenu({ user, onNavigate }) {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useCallback((node) => {
    if (!node) return;
    const handler = (e) => {
      if (!node.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="user-menu" ref={ref}>
      <button
        className="user-avatar-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Account menu for ${user.firstName}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {user.firstName[0].toUpperCase()}
      </button>

      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-info" aria-hidden="true">
            <p className="user-dropdown-name">{user.firstName} {user.lastName}</p>
            <p className="user-dropdown-email">{user.email}</p>
          </div>
          <div className="user-dropdown-actions">
            <button role="menuitem" className="user-dropdown-item"
              onClick={() => { setOpen(false); onNavigate('profile'); }}>
              My Profile
            </button>
            <button role="menuitem" className="user-dropdown-item user-dropdown-logout"
              onClick={() => { logout(); setOpen(false); }}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Header component ── */
function Header({ onNavigate, currentPage }) {
  const { totalItems, openDrawer: openCartDrawer } = useCart();
  const { isLoggedIn, user, logout }               = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoginOpen,  setIsLoginOpen]  = useState(false);

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  /* ESC closes drawer and login modal */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { closeDrawer(); setIsLoginOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  const navigate = useCallback((page) => {
    closeDrawer();
    if (page === 'about') {
      if (currentPage !== 'home') {
        onNavigate('home');
        setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100);
      } else {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    if (page === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onNavigate(page);
  }, [closeDrawer, currentPage, onNavigate]);

  const handleOrderOnline = useCallback(() => {
    closeDrawer();
    if (totalItems > 0) openCartDrawer();
    else onNavigate('menu');
  }, [closeDrawer, totalItems, openCartDrawer, onNavigate]);

  const isActive = (page) => currentPage === page;

  return (
    <>
      {/* ════════════════════════════════════
          STICKY / FIXED HEADER BAR
      ════════════════════════════════════ */}
      <div className="header-wrapper">
        <header className="header" role="banner">

          {/* Left: hamburger (mobile only) */}
          <div className="header-left">
            <button
              className="header-hamburger"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isDrawerOpen}
              aria-controls="nav-drawer"
            >
              <HamburgerIcon />
            </button>
          </div>

          {/* Center: logo (always centered via CSS grid) */}
          <button
            className="header-logo-btn"
            aria-label="Little Lemon — go to home page"
            onClick={() => navigate('home')}
          >
            <img className="header-logo" src={logo} alt="Little Lemon logo" />
          </button>

          {/* Right: desktop nav + desktop user icon + cart */}
          <div className="header-right">

            {/* Desktop nav links — hidden on mobile */}
            <nav className="header-nav-desktop" aria-label="Main navigation">
              <ul className="nav-list">
                <li>
                  <a className="nav-link" href="#"
                    onClick={(e) => { e.preventDefault(); navigate('home'); }}
                    aria-current={isActive('home') ? 'page' : undefined}>Home</a>
                </li>
                <li>
                  <a className="nav-link" href="#about"
                    onClick={(e) => { e.preventDefault(); navigate('about'); }}>About</a>
                </li>
                <li>
                  <a className="nav-link" href="#"
                    onClick={(e) => { e.preventDefault(); navigate('menu'); }}
                    aria-current={isActive('menu') ? 'page' : undefined}>Menu</a>
                </li>
                <li>
                  <a className="nav-link" href="#"
                    onClick={(e) => { e.preventDefault(); navigate('booking'); }}
                    aria-current={isActive('booking') ? 'page' : undefined}>Reservations</a>
                </li>
                <li>
                  <a className="nav-link" href="#"
                    onClick={(e) => { e.preventDefault(); handleOrderOnline(); }}>Order Online</a>
                </li>
              </ul>
            </nav>

            {/* User icon / avatar — DESKTOP ONLY, hidden on mobile via CSS */}
            <div className="header-user-desktop">
              {!isLoggedIn ? (
                <button className="header-icon-btn" onClick={() => setIsLoginOpen(true)}
                  aria-label="Sign in to your account">
                  <UserIcon />
                </button>
              ) : (
                <UserMenu user={user} onNavigate={navigate} />
              )}
            </div>

            {/* Cart — always visible on both mobile and desktop */}
            <button
              className="cart-btn"
              onClick={openCartDrawer}
              aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} item${totalItems !== 1 ? 's' : ''}` : ', empty'}`}
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="cart-badge" aria-hidden="true">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </header>
      </div>

      {/* ════════════════════════════════════
          SLIDE-IN DRAWER (mobile only)
      ════════════════════════════════════ */}
      <div
        id="nav-drawer"
        className={`nav-drawer${isDrawerOpen ? ' open' : ''}`}
        aria-hidden={!isDrawerOpen}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* X close button */}
        <button
          className={`nav-drawer-close${!isLoggedIn ? ' nav-drawer-close--on-dark' : ''}`}
          onClick={closeDrawer}
          aria-label="Close navigation menu"
        >
          <CloseIcon />
        </button>

        {/* ── 1. User profile card ── */}
        <div className={`nd-profile${!isLoggedIn ? ' nd-profile--guest' : ''}`}>
          {isLoggedIn ? (
            <>
              <div className="nd-avatar" aria-hidden="true">
                {user.firstName[0].toUpperCase()}
              </div>
              <div className="nd-profile-info">
                <p className="nd-greeting">Hi, {user.firstName}!</p>
                <button className="nd-view-profile-btn" onClick={() => navigate('profile')}>
                  View Profile
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="nd-welcome-title">Welcome to Little Lemon</h3>
              <p className="nd-welcome-subtitle">Log in to track orders and save your details.</p>
              <button className="nd-login-btn" onClick={() => { closeDrawer(); setIsLoginOpen(true); }}>
                Log In
              </button>
            </>
          )}
        </div>

        {/* ── 2. Unified navigation ── */}
        <nav className="nd-nav" aria-label="Navigation">
          <ul>
            <li>
              <button
                className={`nd-nav-link${isActive('home') ? ' nd-nav-link--active' : ''}`}
                onClick={() => navigate('home')}
              >Home</button>
            </li>
            <li>
              <button
                className={`nd-nav-link${isActive('menu') ? ' nd-nav-link--active' : ''}`}
                onClick={() => navigate('menu')}
              >Menu</button>
            </li>
            <li>
              <button
                className={`nd-nav-link${isActive('booking') ? ' nd-nav-link--active' : ''}`}
                onClick={() => navigate('booking')}
              >Reservations</button>
            </li>
            <li>
              <button className="nd-nav-link" onClick={handleOrderOnline}>
                Order Online
              </button>
            </li>
            <li>
              <button className="nd-nav-link" onClick={() => navigate('about')}>
                About
              </button>
            </li>
            <li>
              <button className="nd-nav-link">Contact</button>
            </li>
          </ul>
        </nav>

        {/* ── 3. Logout at the bottom (only when logged in) ── */}
        {isLoggedIn && (
          <div className="nd-bottom">
            <button className="nd-logout-btn" onClick={() => { logout(); closeDrawer(); }}>
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Dark backdrop */}
      {isDrawerOpen && (
        <div className="nav-drawer-backdrop" aria-hidden="true" onClick={closeDrawer} />
      )}

      {/* Login modal */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}

export default Header;
