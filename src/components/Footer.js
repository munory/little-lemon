function Footer() {
  return (
    <footer>
      <img src="/logo192.png" alt="Little Lemon logo" width="80" />

      <nav aria-label="Footer navigation">
        <h3>Doormat Navigation</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Menu</a></li>
          <li><a href="#">Reservations</a></li>
          <li><a href="#">Order Online</a></li>
          <li><a href="#">Login</a></li>
        </ul>
      </nav>

      <address>
        <h3>Contact</h3>
        <p>123 Main Street, Chicago, IL</p>
        <p><a href="tel:+13125550100">+1 (312) 555-0100</a></p>
        <p><a href="mailto:info@littlelemon.com">info@littlelemon.com</a></p>
      </address>

      <section aria-label="Social Media Links">
        <h3>Social Media Links</h3>
        <ul>
          <li><a href="#">Facebook</a></li>
          <li><a href="#">Instagram</a></li>
          <li><a href="#">Twitter</a></li>
        </ul>
      </section>
    </footer>
  );
}

export default Footer;
