import { useState, useEffect, useCallback } from 'react';

const SIZE_OPTIONS = [
  { label: 'Regular', extra: 0 },
  { label: 'Large',   extra: 3 },
];

const QTY_MIN = 1;
const QTY_MAX = 10;

function SpecialModal({ item, onClose, onAddToCart }) {
  const [size, setSize]     = useState(0);
  const [addons, setAddons] = useState([]);
  const [qty, setQty]       = useState(1);

  const toggleAddon = (id) =>
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const decrement = () => setQty((q) => Math.max(QTY_MIN, q - 1));
  const increment = () => setQty((q) => Math.min(QTY_MAX, q + 1));

  const selectedSize    = SIZE_OPTIONS[size];
  const itemAddons      = item.addons || [];
  const selectedAddons  = itemAddons.filter((a) => addons.includes(a.id));
  const addonTotal      = selectedAddons.reduce((s, a) => s + a.extra, 0);
  const unitPrice       = item.price + selectedSize.extra + addonTotal;
  const itemTotal       = parseFloat((unitPrice * qty).toFixed(2));

  const handleAddToCart = () => {
    onAddToCart({
      id:        item.name.toLowerCase().replace(/\s+/g, '-'),
      name:      item.name,
      basePrice: item.price,
      size:      selectedSize.label,
      addOns:    selectedAddons.map((a) => a.label),
      quantity:  qty,
      unitPrice,
      itemTotal,
    });
    onClose();
    // state resets automatically — modal unmounts on close
  };

  const handleBackdrop = useCallback(
    (e) => { if (e.target === e.currentTarget) onClose(); },
    [onClose]
  );

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-container" role="dialog" aria-modal="true" aria-label={item.name}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>

        <img className="modal-hero-img" src={item.image} alt={item.name} />

        <div className="modal-body">
          <div className="modal-title-row">
            <h2 className="modal-dish-name">{item.name}</h2>
            <span className="modal-base-price">${item.price.toFixed(2)}</span>
          </div>
          <p className="modal-description">{item.description}</p>

          {/* Size */}
          <fieldset className="modal-fieldset">
            <legend>Size</legend>
            <div className="modal-options-row">
              {SIZE_OPTIONS.map((opt, i) => (
                <label key={opt.label} className={`modal-option-pill ${size === i ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="size"
                    value={i}
                    checked={size === i}
                    onChange={() => setSize(i)}
                  />
                  {opt.label}
                  {opt.extra > 0 && <span className="modal-option-extra">+${opt.extra.toFixed(2)}</span>}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Add-ons */}
          <fieldset className="modal-fieldset">
            <legend>Add-ons</legend>
            <div className="modal-options-col">
              {itemAddons.map((addon) => (
                <label
                  key={addon.id}
                  className={`modal-addon-row ${addons.includes(addon.id) ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={addons.includes(addon.id)}
                    onChange={() => toggleAddon(addon.id)}
                  />
                  <span className="modal-addon-label">{addon.label}</span>
                  <span className="modal-option-extra">+${addon.extra.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Quantity */}
          <div className="modal-qty-row">
            <span className="modal-qty-label">Quantity</span>
            <div className="modal-qty-controls">
              <button
                className="modal-qty-btn"
                onClick={decrement}
                disabled={qty === QTY_MIN}
                aria-label="Decrease quantity"
              >−</button>
              <span className="modal-qty-value" aria-live="polite">{qty}</span>
              <button
                className="modal-qty-btn"
                onClick={increment}
                disabled={qty === QTY_MAX}
                aria-label="Increase quantity"
              >+</button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cta" onClick={handleAddToCart}>
            Add to Cart — <strong>${itemTotal.toFixed(2)}</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpecialModal;
