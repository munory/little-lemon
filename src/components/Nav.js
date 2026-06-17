function Nav({ onNavigate, currentPage }) {
  const handle = (e, page) => {
    e.preventDefault();
    if (onNavigate && page) onNavigate(page);
  };

  const isCurrent = (page) => currentPage === page;

  return (
    <nav aria-label="Main navigation">
      <ul className="nav-list">
        <li>
          <a className="nav-link" href="#" onClick={(e) => handle(e, 'home')}
            aria-current={isCurrent('home') ? 'page' : undefined}>Home</a>
        </li>
        <li><a className="nav-link" href="#">About</a></li>
        <li><a className="nav-link" href="#">Menu</a></li>
        <li>
          <a className="nav-link" href="#" onClick={(e) => handle(e, 'booking')}
            aria-current={isCurrent('booking') ? 'page' : undefined}>Reservations</a>
        </li>
        <li><a className="nav-link" href="#">Order Online</a></li>
        <li><a className="nav-link" href="#">Login</a></li>
      </ul>
    </nav>
  );
}

export default Nav;
