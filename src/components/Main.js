import restaurantFood from '../assets/restauranfood.jpg';
import greekSalad from '../assets/greek salad.jpg';
import bruchetta from '../assets/bruchetta.svg';
import lemonDessert from '../assets/lemon dessert.jpg';
import marioA from '../assets/Mario and Adrian A.jpg';
import marioB from '../assets/Mario and Adrian b.jpg';
import photoMaria from '../assets/maria.jpg';
import photoJohn from '../assets/jonh.jpeg';
import photoAnna from '../assets/anna.jpg';
import photoPeter from '../assets/peter.jpg';

function Main({ onReserve }) {
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
          <button className="btn-secondary">Online Menu</button>
        </div>
        <ul className="specials-list">
          <li>
            <article className="specials-card">
              <img src={greekSalad} alt="Greek salad" />
              <div className="specials-card-body">
                <div className="specials-card-title">
                  <h3>Greek salad</h3>
                  <span className="specials-card-price">$ 12.99</span>
                </div>
                <p>
                  The famous greek salad of crispy lettuce, peppers, olives and
                  our Chicago style feta cheese, garnished with crunchy garlic
                  and rosemary croutons.
                </p>
                <a href="#">Order a delivery 🛵</a>
              </div>
            </article>
          </li>
          <li>
            <article className="specials-card">
              <img src={bruchetta} alt="Bruschetta" />
              <div className="specials-card-body">
                <div className="specials-card-title">
                  <h3>Bruschetta</h3>
                  <span className="specials-card-price">$ 5.99</span>
                </div>
                <p>
                  Our Bruschetta is made from grilled bread that has been
                  smeared with garlic and seasoned with salt and olive oil.
                </p>
                <a href="#">Order a delivery 🛵</a>
              </div>
            </article>
          </li>
          <li>
            <article className="specials-card">
              <img src={lemonDessert} alt="Lemon Dessert" />
              <div className="specials-card-body">
                <div className="specials-card-title">
                  <h3>Lemon Dessert</h3>
                  <span className="specials-card-price">$ 5.00</span>
                </div>
                <p>
                  This comes straight from grandma's recipe book, every last
                  ingredient has been sourced and is as authentic as you can
                  imagine.
                </p>
                <a href="#">Order a delivery 🛵</a>
              </div>
            </article>
          </li>
        </ul>
      </section>

      <section className="testimonials" aria-label="Testimonials">
        <h2>Testimonials</h2>
        <ul className="testimonials-list">
          {[
            { name: 'Maria',  photo: photoMaria,  review: 'Amazing food and atmosphere! The Greek salad is to die for.' },
            { name: 'John',   photo: photoJohn,   review: 'Best Mediterranean food in Chicago. Highly recommend!' },
            { name: 'Anna',   photo: photoAnna,   review: 'Authentic recipes, incredible taste. We come back every week.' },
            { name: 'Peter',  photo: photoPeter,  review: 'Cozy place with wonderful staff. Will definitely come back.' },
          ].map((item) => (
            <li key={item.name}>
              <article className="testimonial-card">
                <p className="testimonial-rating">⭐⭐⭐⭐⭐</p>
                <div className="testimonial-author">
                  <img src={item.photo} alt={`${item.name} photo`} />
                  <h3>{item.name}</h3>
                </div>
                <p>{item.review}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="about" aria-label="About">
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
