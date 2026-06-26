function DishCard({ item, onSelect }) {
  return (
    <article
      className="dish-card"
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.name} details`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(item)}
    >
      <img src={item.image} alt={item.name} className="dish-card-img" />
      <div className="dish-card-body">
        <div className="dish-card-title-row">
          <h3>{item.name}</h3>
          <span className="dish-card-price">$ {item.price.toFixed(2)}</span>
        </div>
        <p className="dish-card-ingredients">{item.ingredients}</p>
        <p className="dish-card-desc">{item.description}</p>
        <span className="dish-card-add-btn">Order a delivery 🛵</span>
      </div>
    </article>
  );
}

export default DishCard;
