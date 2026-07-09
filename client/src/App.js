import { useMemo, useState } from 'react';
import './App.css';
import { menuCategories, menuItems } from './data/menuData';

const restaurantInfo = {
  name: 'Sedmica',
  subtitle: 'Pizzeria i dostava u Novom Sadu',
  address: 'Kraljevica Marka 23, Novi Sad',
  phone: '066 817 1717',
  workHours: 'Svakog dana od 07 do 23h',
};

function App() {
  const [activeCategory, setActiveCategory] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(menuItems[0]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'Sve' || item.category === activeCategory;
      const matchesSearch = !normalizedSearch
        || item.name.toLowerCase().includes(normalizedSearch)
        || item.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

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
          <div className="section-heading">
            <div>
              <p className="eyebrow">Meni</p>
              <h2>Izaberi sta ti se jede</h2>
              <p>Pregledaj glavna jela iz Sedmice, proveri cenu i otvori detalje pre porucivanja.</p>
            </div>

            <label className="search-box" htmlFor="menu-search">
              <span>Pretraga</span>
              <input
                id="menu-search"
                type="search"
                placeholder="Pizza, pasta, piletina..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>

          <div className="category-tabs" aria-label="Kategorije menija">
            {menuCategories.map((category) => (
              <button
                className={activeCategory === category ? 'is-active' : ''}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-layout">
            <div className="menu-grid" aria-live="polite">
              {filteredItems.map((item) => (
                <article className="menu-card" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="menu-card-body">
                    <div className="menu-card-top">
                      <span>{item.category}</span>
                      {item.popular && <strong>Popularno</strong>}
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="menu-card-actions">
                      <b>{item.price.toLocaleString('sr-RS')} RSD</b>
                      <button type="button" onClick={() => setSelectedItem(item)}>
                        Detalji
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="dish-details" aria-label="Detalji jela">
              <img src={selectedItem.image} alt={selectedItem.name} />
              <span>{selectedItem.category}</span>
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
              <div className="detail-row">
                <strong>{selectedItem.price.toLocaleString('sr-RS')} RSD</strong>
                <small>{selectedItem.available ? 'Dostupno danas' : 'Trenutno nedostupno'}</small>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
