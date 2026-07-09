import './App.css';

const restaurantInfo = {
  name: 'Sedmica',
  subtitle: 'Pizzeria i dostava u Novom Sadu',
  address: 'Kraljevica Marka 23, Novi Sad',
  phone: '066 817 1717',
  workHours: 'Svakog dana od 07 do 23h',
};

function App() {
  return (
    <div className="app">
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
          <a href="#dostava">Dostava</a>
          <a href="#kontakt">Kontakt</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">{restaurantInfo.workHours}</p>
            <h1>Pizzeria Sedmica</h1>
            <p>
              Topla pizza, pasta i omiljena glavna jela iz nase kuhinje. Izaberi obrok,
              dodaj ga u korpu i poruci bez cekanja.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#meni">Pogledaj meni</a>
              <a className="secondary-action" href={`tel:${restaurantInfo.phone}`}>Pozovi lokal</a>
            </div>
          </div>

          <div className="hero-card" aria-label="Informacije o lokalu">
            <span>Adresa</span>
            <strong>{restaurantInfo.address}</strong>
            <span>Telefon</span>
            <strong>{restaurantInfo.phone}</strong>
          </div>
        </section>

        <section className="intro-grid" id="dostava">
          <article>
            <span>01</span>
            <h2>Sveze iz kuhinje</h2>
            <p>Jela se pripremaju po porudzbini, sa jasnim cenama i dostupnoscu.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Brzo porucivanje</h2>
            <p>Korpa i checkout su pripremljeni za online narucivanje i placanje.</p>
          </article>
          <article id="kontakt">
            <span>03</span>
            <h2>Dostava i preuzimanje</h2>
            <p>Porudzbinu mozes preuzeti u lokalu ili traziti dostavu u okolini.</p>
          </article>
        </section>

        <section className="menu-preview" id="meni">
          <p className="eyebrow">Meni</p>
          <h2>Uskoro kompletan izbor jela</h2>
          <p>U sledecem koraku dodajemo proizvode, kategorije, filtere i detaljan prikaz.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
