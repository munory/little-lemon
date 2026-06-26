import { useCallback, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function CartDrawer({ onCheckout }) {
  const { items, subtotal, isDrawerOpen, closeDrawer, removeItem, updateQty } = useCart();
  const asideRef = useRef(null);

  // Set inert via DOM property to avoid React's JSX boolean-attribute warning
  useEffect(() => {
    if (asideRef.current) asideRef.current.inert = !isDrawerOpen;
  }, [isDrawerOpen]);

  const handleBackdrop = useCallback(
    (e) => { if (e.target === e.currentTarget) closeDrawer(); },
    [closeDrawer]
  );

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', onKey);
    const sw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div
      className={`drawer-overlay${isDrawerOpen ? ' open' : ''}`}
      onClick={handleBackdrop}
    >
      <aside
        ref={asideRef}
        className={`cart-drawer${isDrawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Your Order"
      >
        <div className="drawer-header">
          <h2>Your Order</h2>
          <button className="drawer-close" onClick={closeDrawer} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <span className="drawer-empty-icon" aria-hidden="true">🛒</span>
              <p>Your cart is empty</p>
              <span>Add items from the menu to get started</span>
            </div>
          ) : (
            <ul className="drawer-item-list">
              {items.map((item, idx) => {
                const metaParts = [
                  item.size !== 'Regular' && item.size,
                  ...item.addOns,
                ].filter(Boolean);

                return (
                  <li key={`${item.id}-${idx}`} className="drawer-item">
                    <div className="drawer-item-info">
                      <span className="drawer-item-name">{item.name}</span>
                      {metaParts.length > 0 && (
                        <span className="drawer-item-meta">{metaParts.join(', ')}</span>
                      )}
                      <span className="drawer-item-price">${item.itemTotal.toFixed(2)}</span>
                    </div>

                    <div className="drawer-item-controls">
                      <div className="drawer-qty" role="group" aria-label={`${item.name} quantity`}>
                        <button
                          className="drawer-qty-btn"
                          onClick={() => updateQty(idx, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span aria-live="polite">{item.quantity}</span>
                        <button
                          className="drawer-qty-btn"
                          onClick={() => updateQty(idx, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <button
                        className="drawer-remove"
                        onClick={() => removeItem(idx)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className="drawer-checkout" onClick={() => { closeDrawer(); onCheckout?.(); }}>
              Checkout — ${subtotal.toFixed(2)}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
