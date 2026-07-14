const Header = ({ restaurantInfo, cartCount, isLoggedIn, isAdmin }) => (
  <header className="site-header">
    <button className="brand" type="button" aria-label="Sedmica pocetna">
      <span className="brand-symbol">7</span>
      <span>
        <strong>{restaurantInfo.name}</strong>
        <small>{restaurantInfo.subtitle}</small>
      </span>
    </button>

    <nav className="main-nav" aria-label="Glavna navigacija">
      <a href="#meni">Meni</a>
      <a href="#korpa">Korpa {cartCount > 0 && <span>{cartCount}</span>}</a>
      <a href="#prijava">{isLoggedIn ? 'Nalog' : 'Prijava'}</a>
      <a href="#porudzbine">Porudzbine</a>
      {isAdmin && <a href="#admin">Admin</a>}
      <a href="#dostava">Dostava</a>
      <a href="#kontakt">Kontakt</a>
    </nav>
  </header>
);

export default Header;
