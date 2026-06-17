function Nav({ onNavigate }) {
  const handle = (e, page) => {
    e.preventDefault();
    if (onNavigate && page) onNavigate(page);
  };

  return (
    <nav>
      <ul className="nav-list">
        <li><a className="nav-link" href="#" onClick={(e) => handle(e, 'home')}>Home</a></li>
        <li><a className="nav-link" href="#">About</a></li>
        <li><a className="nav-link" href="#">Menu</a></li>
        <li><a className="nav-link" href="#" onClick={(e) => handle(e, 'booking')}>Reservations</a></li>
        <li><a className="nav-link" href="#">Order Online</a></li>
        <li><a className="nav-link" href="#">Login</a></li>
      </ul>
    </nav>
  );
}

export default Nav;
