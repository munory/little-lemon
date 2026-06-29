import logo from '../assets/Logo.svg';
import { RESTAURANT } from '../constants';

function Footer({ onNavigate }) {
  const handle = (e, page) => {
    e.preventDefault();
    if (page === 'about') {
      onNavigate('home');
      setTimeout(() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      onNavigate(page);
    }
  };

  return (
    <footer className="footer">
      <button
        className="footer-logo-btn"
        onClick={(e) => handle(e, 'home')}
        aria-label="Little Lemon — go to home page"
      >
        <img className="footer-logo" src={logo} alt="Little Lemon logo" />
      </button>

      <nav aria-label="Footer navigation">
        <h3>Navigation</h3>
        <ul className="footer-nav-list">
          <li><a href="#" onClick={(e) => handle(e, 'home')}>Home</a></li>
          <li><a href="#" onClick={(e) => handle(e, 'about')}>About</a></li>
          <li><a href="#" onClick={(e) => handle(e, 'menu')}>Menu</a></li>
          <li><a href="#" onClick={(e) => handle(e, 'booking')}>Reservations</a></li>
          <li><a href="#" onClick={(e) => handle(e, 'menu')}>Order Online</a></li>
        </ul>
      </nav>

      <address>
        <h3>Contact</h3>
        <p>{RESTAURANT.street}, {RESTAURANT.city}, {RESTAURANT.state}</p>
        <p><a href={`tel:${RESTAURANT.phone.replace(/\s|\(|\)|-/g, '')}`}>{RESTAURANT.phone}</a></p>
        <p><a href="mailto:info@littlelemon.com">info@littlelemon.com</a></p>
      </address>

      <section aria-label="Social media links">
        <h3>Social Media</h3>
        <ul className="footer-social-list">
          <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
          <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
          <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
        </ul>
      </section>
    </footer>
  );
}

export default Footer;
