# Sedmica restoran

Web aplikacija za restoran Sedmica namenjena za pregled menija, porucivanje hrane i administraciju restorana.

## Tehnologije

- React.js
- Node.js
- Express.js
- MongoDB / Mongoose priprema

Backend moze da radi i bez lokalne MongoDB baze jer koristi memorijske seed podatke. Ako se doda `MONGO_URI`, server pokusava MongoDB konekciju.

## Uloge

- Gost: pregleda meni, cene i dostupnost proizvoda.
- Registrovani korisnik: prijava/registracija, dodavanje u korpu, potvrda porudzbine i pregled porudzbina.
- Administrator: pregled korisnika, upravljanje dostupnoscu proizvoda i promena statusa porudzbine.

Admin nalog za probu:

```text
email: admin@sedmica.rs
lozinka: sedmica123
```

## Pokretanje frontenda

```bash
cd client
npm install
npm start
```

Frontend se pokrece na:

```text
http://localhost:3000
```

## Pokretanje backend-a

```bash
cd server
npm install
npm run dev
```

Backend se pokrece na:

```text
http://localhost:5000
```

Health ruta:

```text
GET /api/health
```

## API rute

Autentikacija:

```text
POST /api/auth/register
POST /api/auth/login
```

Meni i kategorije:

```text
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

Porudzbine:

```text
GET   /api/orders
POST  /api/orders
PATCH /api/orders/:id/status
```

Korisnici:

```text
GET   /api/users
PATCH /api/users/:id/role
```

Admin rute koriste header:

```text
x-user-email: admin@sedmica.rs
```

## Provera projekta

```bash
cd client
npm test -- --watchAll=false
npm run build
```

```bash
cd server
npm start
```
