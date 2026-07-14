import Rating from './Rating';

const Product = ({ item, isLoggedIn, onAddToCart }) => {
  const ratingValue = item.popular ? 4.9 : 4.7;

  return (
    <article className="menu-card">
      <img src={item.image} alt={item.name} />
      <div className="menu-card-body">
        <div className="menu-card-top">
          <span>{item.category}</span>
          {item.popular && <strong>Popularno</strong>}
          {!item.available && <strong className="muted-badge">Nedostupno</strong>}
        </div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <Rating value={ratingValue} text={`${ratingValue.toFixed(1)} ocena gostiju`} />
        <div className="menu-card-actions">
          <b>{item.price.toLocaleString('sr-RS')} RSD</b>
          <span>
            <button
              disabled={!item.available}
              type="button"
              onClick={() => onAddToCart(item)}
            >
              {!item.available ? 'Nema' : isLoggedIn ? 'Dodaj' : 'Prijava'}
            </button>
          </span>
        </div>
      </div>
    </article>
  );
};

export default Product;
