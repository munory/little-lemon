import { useState } from 'react';
import { useCart } from '../context/CartContext';
import restaurantFood from '../assets/restauranfood.jpg';
import greekSalad from '../assets/greek salad.jpg';
import bruchetta from '../assets/bruchetta.jpg';
import lemonDessert from '../assets/lemon dessert.jpg';
import marioA from '../assets/Mario and Adrian A.jpg';
import marioB from '../assets/Mario and Adrian b.jpg';
import photoMaria from '../assets/maria.jpg';
import photoJohn from '../assets/jonh.jpeg';
import photoAnna from '../assets/anna.jpg';
import photoPeter from '../assets/peter.jpg';
import SpecialModal from './SpecialModal';
import TestimonialsCarousel from './TestimonialsCarousel';

const SPECIALS = [
  {
    id: 1,
    name: 'Greek Salad',
    price: 12.99,
    image: greekSalad,
    description: 'The famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.',
    addons: [
      { id: 'feta',    label: 'Extra Feta',       extra: 1.50 },
      { id: 'avocado', label: 'Avocado',           extra: 2.00 },
      { id: 'chicken', label: 'Grilled Chicken',   extra: 3.00 },
      { id: 'olives',  label: 'Kalamata Olives',   extra: 1.00 },
    ],
  },
  {
    id: 2,
    name: 'Bruschetta',
    price: 5.99,
    image: bruchetta,
    description: 'Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.',
    addons: [
      { id: 'tomatoes',    label: 'Sun-Dried Tomatoes', extra: 1.00 },
      { id: 'basil',       label: 'Fresh Basil',        extra: 0.75 },
      { id: 'mozzarella',  label: 'Mozzarella',         extra: 1.50 },
      { id: 'prosciutto',  label: 'Prosciutto',         extra: 2.50 },
    ],
  },
  {
    id: 3,
    name: 'Lemon Dessert',
    price: 5.00,
    image: lemonDessert,
    description: 'This comes straight from grandma\'s recipe book, every last ingredient has been sourced and is as authentic as you can imagine.',
    addons: [
      { id: 'cream',    label: 'Whipped Cream',      extra: 1.00 },
      { id: 'icecream', label: 'Vanilla Ice Cream',  extra: 2.00 },
      { id: 'curd',     label: 'Extra Lemon Curd',   extra: 1.50 },
      { id: 'berries',  label: 'Mixed Berries',      extra: 1.50 },
    ],
  },
];

const TESTIMONIALS = [
  { id: 1, name: 'Maria',   photo: photoMaria,  rating: 5, review: 'Amazing food and atmosphere! The Greek salad is absolutely to die for.' },
  { id: 2, name: 'John',    photo: photoJohn,   rating: 5, review: 'Best Mediterranean food in Chicago. Highly recommend to everyone!' },
  { id: 3, name: 'Anna',    photo: photoAnna,   rating: 5, review: 'Authentic recipes, incredible taste. We come back every week without fail.' },
  { id: 4, name: 'Peter',   photo: photoPeter,  rating: 5, review: 'Cozy place with wonderful staff. Will definitely come back with the whole family.' },
  { id: 5, name: 'Sophie',  photo: photoMaria,  rating: 5, review: 'The lemon dessert is absolutely divine! I dream about it every single night.' },
  { id: 6, name: 'James',   photo: photoJohn,   rating: 5, review: 'A must-visit spot in Chicago. The bruschetta is the best I\'ve ever had.' },
];

function Main({ onReserve, onMenu }) {
  const [modalItem, setModalItem] = useState(null);
  const { addItem } = useCart();
  return (
    <main>
      <section className="hero" aria-label="Hero">
        <article className="hero-text">
          <h1>Little Lemon</h1>
          <h2>Chicago</h2>
          <p>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </p>
          <button
            className="btn-primary"
            onClick={onReserve}
          >
            Reserve a Table
          </button>
        </article>
        <img
          className="hero-image"
          src={restaurantFood}
          alt="Delicious food served at Little Lemon"
        />
      </section>

      <section className="specials" aria-label="Specials">
        <div className="specials-header">
          <h2>This weeks specials!</h2>
          <button className="btn-secondary" onClick={onMenu}>Online Menu</button>
        </div>
        <ul className="specials-list">
          {SPECIALS.map((item) => (
            <li key={item.id}>
              <article
                className="specials-card"
                onClick={() => setModalItem(item)}
                role="button"
                tabIndex={0}
                aria-label={`View ${item.name} details`}
                onKeyDown={(e) => e.key === 'Enter' && setModalItem(item)}
              >
                <img src={item.image} alt={item.name} />
                <div className="specials-card-body">
                  <div className="specials-card-title">
                    <h3>{item.name}</h3>
                    <span className="specials-card-price">$ {item.price.toFixed(2)}</span>
                  </div>
                  <p>{item.description}</p>
                  <span className="specials-card-link">Order a delivery 🛵</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {modalItem && (
        <SpecialModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onAddToCart={addItem}
        />
      )}

      <section className="testimonials" aria-label="Testimonials">
        <TestimonialsCarousel items={TESTIMONIALS} title="Testimonials" />
      </section>

      <section id="about" className="about" aria-label="About">
        <article className="about-text">
          <h2>Little Lemon</h2>
          <h3>Chicago</h3>
          <p>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist. Our chefs draw
            from the rich culinary traditions of the Mediterranean to bring
            you dishes made with the finest locally sourced ingredients.
          </p>
        </article>
        <div className="about-images">
          <img src={marioA} alt="Mario and Adrian, restaurant owners" />
          <img src={marioB} alt="Chef preparing food at Little Lemon" />
        </div>
      </section>
    </main>
  );
}

export default Main;
