const Rating = ({ value = 4.8, text }) => {
  const stars = [1, 2, 3, 4, 5];
  const starPoints = '12 2 14.9 8.6 22 9.2 16.6 13.8 18.2 20.8 12 17.1 5.8 20.8 7.4 13.8 2 9.2 9.1 8.6';

  const getStarFill = (star) => {
    if (value >= star) {
      return 100;
    }

    if (value >= star - 0.5) {
      return 50;
    }

    return 0;
  };

  return (
    <div className="rating" aria-label={`Ocena ${value} od 5`}>
      <span className="rating-stars" aria-hidden="true">
        {stars.map((star) => (
          <svg className="rating-star" key={star} viewBox="0 0 24 24" role="img">
            <polygon className="rating-star-empty" points={starPoints} />
            <polygon
              className="rating-star-fill"
              points={starPoints}
              style={{ clipPath: `inset(0 ${100 - getStarFill(star)}% 0 0)` }}
            />
          </svg>
        ))}
      </span>
      {text && <small className="rating-text">{text}</small>}
    </div>
  );
};

export default Rating;
