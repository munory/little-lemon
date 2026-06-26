import { useState } from 'react';
import { useCart } from '../context/CartContext';
import DishCard from './DishCard';
import DishModal from './DishModal';
import menuData from '../data/menuData';

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDish, setSelectedDish]     = useState(null);
  const { addItem } = useCart();

  const filtered = activeCategory === 'All'
    ? menuData
    : menuData.filter((d) => d.category === activeCategory);

  return (
    <main className="menu-page">
      <div className="menu-page-hero">
        <h1 className="menu-page-title">Our Menu</h1>
        <p className="menu-page-subtitle">Mediterranean flavors, crafted fresh every day</p>
      </div>

      <nav className="menu-category-tabs" aria-label="Menu categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`menu-tab-btn${activeCategory === cat ? ' active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </nav>

      <ul className="menu-grid" aria-label={`${activeCategory} dishes`}>
        {filtered.map((dish) => (
          <li key={dish.id}>
            <DishCard item={dish} onSelect={setSelectedDish} />
          </li>
        ))}
      </ul>

      {selectedDish && (
        <DishModal
          item={selectedDish}
          onClose={() => setSelectedDish(null)}
          onAddToCart={addItem}
        />
      )}
    </main>
  );
}

export default MenuPage;
