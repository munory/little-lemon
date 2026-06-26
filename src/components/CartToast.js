import { useCart } from '../context/CartContext';

function CartToast() {
  const { toast } = useCart();

  return (
    <div className={`cart-toast${toast ? ' visible' : ''}`} role="status" aria-live="polite">
      <span className="toast-check" aria-hidden="true">✓</span>
      {toast && <span><strong>{toast}</strong> added to cart!</span>}
    </div>
  );
}

export default CartToast;
