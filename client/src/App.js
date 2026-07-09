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
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState('Dostava');
  const [paymentMethod, setPaymentMethod] = useState('Kartica');
  const [orderNote, setOrderNote] = useState('');

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

  const cartTotal = cartItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
  const cartCount = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  const addToCart = (item) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentItems.map((cartItem) => (
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        ));
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (itemId, nextQuantity) => {
    if (nextQuantity < 1) {
      setCartItems((currentItems) => currentItems.filter((cartItem) => cartItem.id !== itemId));
      return;
    }

    setCartItems((currentItems) => currentItems.map((cartItem) => (
      cartItem.id === itemId ? { ...cartItem, quantity: nextQuantity } : cartItem
    )));
  };

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
          <a href="#korpa">Korpa {cartCount > 0 && <span>{cartCount}</span>}</a>
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
                      <span>
                        <button type="button" onClick={() => setSelectedItem(item)}>
                          Detalji
                        </button>
                        <button type="button" onClick={() => addToCart(item)}>
                          Dodaj
                        </button>
                      </span>
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
              <button className="wide-action" type="button" onClick={() => addToCart(selectedItem)}>
                Dodaj u korpu
              </button>
            </aside>
          </div>
        </section>

        <section className="checkout-section" id="korpa">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Korpa</p>
              <h2>Tvoja porudzbina</h2>
              <p>Proveri stavke, izaberi nacin preuzimanja i pripremi placanje.</p>
            </div>
            <strong className="cart-total">{cartTotal.toLocaleString('sr-RS')} RSD</strong>
          </div>

          <div className="checkout-layout">
            <div className="cart-panel">
              {cartItems.length === 0 ? (
                <p className="empty-cart">Korpa je prazna. Dodaj jelo iz menija da zapocnes porudzbinu.</p>
              ) : (
                cartItems.map((cartItem) => (
                  <article className="cart-item" key={cartItem.id}>
                    <div>
                      <h3>{cartItem.name}</h3>
                      <p>{cartItem.price.toLocaleString('sr-RS')} RSD po komadu</p>
                    </div>
                    <div className="quantity-controls" aria-label={`Kolicina za ${cartItem.name}`}>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{cartItem.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <strong>{(cartItem.price * cartItem.quantity).toLocaleString('sr-RS')} RSD</strong>
                  </article>
                ))
              )}
            </div>

            <aside className="order-panel" aria-label="Podaci za porudzbinu">
              <div className="option-group">
                <span>Preuzimanje</span>
                <div>
                  {['Dostava', 'Licno preuzimanje'].map((method) => (
                    <button
                      className={deliveryMethod === method ? 'is-active' : ''}
                      key={method}
                      type="button"
                      onClick={() => setDeliveryMethod(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <span>Placanje</span>
                <div>
                  {['Kartica', 'Gotovina'].map((method) => (
                    <button
                      className={paymentMethod === method ? 'is-active' : ''}
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <label className="note-field" htmlFor="order-note">
                Napomena
                <textarea
                  id="order-note"
                  placeholder="Adresa, sprat, posebna napomena za kuhinju..."
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                />
              </label>

              <div className="summary-line">
                <span>{deliveryMethod}</span>
                <strong>{paymentMethod}</strong>
              </div>
              <button className="checkout-button" disabled={cartItems.length === 0} type="button">
                Nastavi na porucivanje
              </button>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
