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
  const [products, setProducts] = useState(menuItems);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState('Dostava');
  const [paymentMethod, setPaymentMethod] = useState('Kartica');
  const [orderNote, setOrderNote] = useState('');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([
    { name: 'Gost', email: '-', role: 'gost' },
  ]);
  const [orderMessage, setOrderMessage] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [authNotice, setAuthNotice] = useState('Prijavi se da bi mogao da dodajes jela u korpu.');

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((item) => {
      const matchesCategory = activeCategory === 'Sve' || item.category === activeCategory;
      const matchesSearch = !normalizedSearch
        || item.name.toLowerCase().includes(normalizedSearch)
        || item.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchTerm]);

  const cartTotal = cartItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0);
  const cartCount = cartItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  const isLoggedIn = Boolean(currentUser);
  const isAdmin = currentUser?.role === 'administrator';
  const needsDeliveryAddress = deliveryMethod === 'Dostava' && orderNote.trim().length === 0;

  const handleAuthChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const submitAuth = (event) => {
    event.preventDefault();
    const trimmedName = authForm.name.trim();
    const trimmedEmail = authForm.email.trim();

    if (!trimmedEmail || !authForm.password) {
      setAuthNotice('Unesi email i lozinku za prijavu.');
      return;
    }

    if (authMode === 'register' && (!trimmedName || authForm.password.length < 6)) {
      setAuthNotice('Za registraciju unesi ime i lozinku od najmanje 6 karaktera.');
      return;
    }

    const nextUser = {
      name: trimmedName || trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: trimmedEmail.toLowerCase() === 'admin@sedmica.rs' ? 'administrator' : 'registrovani korisnik',
    };

    setCurrentUser(nextUser);
    setUsers((currentUsers) => {
      if (currentUsers.some((user) => user.email === nextUser.email)) {
        return currentUsers;
      }

      return [...currentUsers, nextUser];
    });
    setAuthNotice('Uspesno si prijavljen. Mozes da nastavis porucivanje.');
  };

  const logout = () => {
    setCurrentUser(null);
    setCartItems([]);
    setAuthNotice('Odjavljen si. Meni ostaje dostupan za pregled.');
  };

  const addToCart = (item) => {
    if (!isLoggedIn) {
      setAuthNotice('Za dodavanje u korpu prvo se prijavi ili registruj.');
      document.getElementById('prijava')?.scrollIntoView?.({ behavior: 'smooth' });
      return;
    }

    if (!item.available) {
      setOrderMessage(`${item.name} trenutno nije dostupan za porucivanje.`);
      return;
    }

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

  const createOrder = () => {
    if (!isLoggedIn) {
      setAuthNotice('Za potvrdu porudzbine prvo se prijavi.');
      document.getElementById('prijava')?.scrollIntoView?.({ behavior: 'smooth' });
      return;
    }

    if (cartItems.length === 0) {
      setOrderMessage('Korpa je prazna. Izaberi jelo iz menija.');
      return;
    }

    if (needsDeliveryAddress) {
      setOrderMessage('Za dostavu unesi adresu u napomeni.');
      return;
    }

    const nextOrder = {
      id: `SED-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toLocaleDateString('sr-RS'),
      items: cartItems,
      total: cartTotal,
      deliveryMethod,
      paymentMethod,
      note: orderNote.trim(),
      status: 'Primljena',
    };

    setOrders((currentOrders) => [nextOrder, ...currentOrders]);
    setCartItems([]);
    setOrderNote('');
    setOrderMessage(`Porudzbina ${nextOrder.id} je primljena.`);
    document.getElementById('porudzbine')?.scrollIntoView?.({ behavior: 'smooth' });
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((currentOrders) => currentOrders.map((order) => (
      order.id === orderId ? { ...order, status: nextStatus } : order
    )));
  };

  const toggleProductAvailability = (productId) => {
    setProducts((currentProducts) => currentProducts.map((product) => (
      product.id === productId ? { ...product, available: !product.available } : product
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
          <a href="#prijava">{isLoggedIn ? 'Nalog' : 'Prijava'}</a>
          <a href="#porudzbine">Porudzbine</a>
          {isAdmin && <a href="#admin">Admin</a>}
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

          <div className="hero-card" id="kontakt" aria-label="Informacije o lokalu">
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
          <article>
            <span>03</span>
            <h2>Dostava i preuzimanje</h2>
            <p>Porudzbinu mozes preuzeti u lokalu ili traziti dostavu u okolini.</p>
          </article>
        </section>

        <section className="auth-section" id="prijava">
          <div>
            <p className="eyebrow">{isLoggedIn ? 'Nalog' : 'Prijava'}</p>
            <h2>{isLoggedIn ? `Zdravo, ${currentUser.name}` : 'Prijavi se za porucivanje'}</h2>
            <p>
              Kao gost mozes da pregledas meni i cene, a porucivanje se aktivira nakon prijave.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="account-card">
              <span>{currentUser.role}</span>
              <strong>{currentUser.email}</strong>
              <small>{orders.length === 1 ? '1 porudzbina' : `${orders.length} porudzbina`}</small>
              <button type="button" onClick={logout}>Odjavi se</button>
            </div>
          ) : (
            <form className="auth-form" onSubmit={submitAuth}>
              <div className="auth-tabs" aria-label="Tip forme">
                <button
                  className={authMode === 'login' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setAuthMode('login')}
                >
                  Prijava
                </button>
                <button
                  className={authMode === 'register' ? 'is-active' : ''}
                  type="button"
                  onClick={() => setAuthMode('register')}
                >
                  Registracija
                </button>
              </div>

              {authMode === 'register' && (
                <label htmlFor="auth-name">
                  Ime
                  <input
                    id="auth-name"
                    name="name"
                    type="text"
                    value={authForm.name}
                    onChange={handleAuthChange}
                  />
                </label>
              )}

              <label htmlFor="auth-email">
                Email
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  value={authForm.email}
                  onChange={handleAuthChange}
                />
              </label>

              <label htmlFor="auth-password">
                Lozinka
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                />
              </label>

              <p className="auth-notice">{authNotice}</p>
              <button className="auth-submit" type="submit">
                {authMode === 'register' ? 'Registruj se' : 'Prijavi se'}
              </button>
            </form>
          )}
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
                      {!item.available && <strong className="muted-badge">Nedostupno</strong>}
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="menu-card-actions">
                      <b>{item.price.toLocaleString('sr-RS')} RSD</b>
                      <span>
                        <button
                          disabled={!item.available}
                          type="button"
                          onClick={() => addToCart(item)}
                        >
                          {!item.available ? 'Nema' : isLoggedIn ? 'Dodaj' : 'Prijava'}
                        </button>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
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
              {orderMessage && <p className="order-message">{orderMessage}</p>}
              <button
                className="checkout-button"
                disabled={cartItems.length === 0 || needsDeliveryAddress}
                type="button"
                onClick={createOrder}
              >
                Potvrdi porudzbinu
              </button>
            </aside>
          </div>
        </section>

        <section className="orders-section" id="porudzbine">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Porudzbine</p>
              <h2>Pregled porudzbina</h2>
              <p>Ovde mozes da pratis porudzbine napravljene preko svog naloga.</p>
            </div>
          </div>

          {!isLoggedIn ? (
            <p className="empty-cart">Prijavi se da bi video svoje porudzbine.</p>
          ) : orders.length === 0 ? (
            <p className="empty-cart">Jos uvek nemas porudzbina.</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div>
                    <span>{order.id}</span>
                    <h3>{order.status}</h3>
                    <p>{order.createdAt} · {order.deliveryMethod} · {order.paymentMethod}</p>
                  </div>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>
                  {order.note && <p className="order-note">Napomena: {order.note}</p>}
                  <strong>{order.total.toLocaleString('sr-RS')} RSD</strong>
                </article>
              ))}
            </div>
          )}
        </section>

        {isAdmin && (
          <section className="admin-section" id="admin">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Admin</p>
                <h2>Upravljanje restoranom</h2>
                <p>Pregled proizvoda, porudzbina i korisnika za osoblje Sedmice.</p>
              </div>
            </div>

            <div className="admin-grid">
              <article className="admin-panel">
                <h3>Proizvodi</h3>
                <div className="admin-list">
                  {products.map((product) => (
                    <div className="admin-row" key={product.id}>
                      <span>{product.name}</span>
                      <strong>{product.price.toLocaleString('sr-RS')} RSD</strong>
                      <button type="button" onClick={() => toggleProductAvailability(product.id)}>
                        {product.available ? 'Sakrij' : 'Vrati'}
                      </button>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <h3>Porudzbine</h3>
                {orders.length === 0 ? (
                  <p className="empty-cart">Nema novih porudzbina.</p>
                ) : (
                  <div className="admin-list">
                    {orders.map((order) => (
                      <div className="admin-row" key={order.id}>
                        <span>{order.id}</span>
                        <strong>{order.status}</strong>
                        <select
                          aria-label={`Status porudzbine ${order.id}`}
                          value={order.status}
                          onChange={(event) => updateOrderStatus(order.id, event.target.value)}
                        >
                          <option>Primljena</option>
                          <option>U pripremi</option>
                          <option>Spremna</option>
                          <option>Zavrsena</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className="admin-panel">
                <h3>Korisnici</h3>
                <div className="admin-list">
                  {users.map((user) => (
                    <div className="admin-row" key={`${user.email}-${user.role}`}>
                      <span>{user.name}</span>
                      <strong>{user.role}</strong>
                      <small>{user.email}</small>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
