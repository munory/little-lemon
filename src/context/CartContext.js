import { createContext, useContext, useReducer, useState, useCallback, useRef } from 'react';
import { MAX_CART_QTY } from '../constants';

const CartContext = createContext({
  items: [],
  totalItems: 0,
  subtotal: 0,
  isDrawerOpen: false,
  toast: null,
  addItem:    () => {},
  removeItem: () => {},
  updateQty:  () => {},
  clearCart:  () => {},
  openDrawer:  () => {},
  closeDrawer: () => {},
});

const itemKey = (item) =>
  `${item.id}|${item.size}|${[...item.addOns].sort().join(',')}`;

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = itemKey(action.payload);
      const idx = state.findIndex((i) => itemKey(i) === key);
      if (idx >= 0) {
        const updated = [...state];
        const prev = updated[idx];
        const newQty = Math.min(MAX_CART_QTY, prev.quantity + action.payload.quantity);
        updated[idx] = {
          ...prev,
          quantity: newQty,
          itemTotal: parseFloat((prev.unitPrice * newQty).toFixed(2)),
        };
        return updated;
      }
      return [...state, action.payload];
    }
    case 'REMOVE_ITEM':
      return state.filter((_, i) => i !== action.index);
    case 'UPDATE_QTY':
      return state.map((item, i) => {
        if (i !== action.index) return item;
        const newQty = Math.max(1, Math.min(MAX_CART_QTY, action.qty));
        return { ...item, quantity: newQty, itemTotal: parseFloat((item.unitPrice * newQty).toFixed(2)) };
      });
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(item.name);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const removeItem = useCallback((index) => dispatch({ type: 'REMOVE_ITEM', index }), []);
  const updateQty  = useCallback((index, qty)  => dispatch({ type: 'UPDATE_QTY', index, qty }), []);
  const clearCart  = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);
  const openDrawer  = useCallback(() => setIsDrawerOpen(true),  []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = parseFloat(items.reduce((s, i) => s + i.itemTotal, 0).toFixed(2));

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotal, isDrawerOpen, toast, addItem, removeItem, updateQty, clearCart, openDrawer, closeDrawer }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
