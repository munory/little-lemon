import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';

// ── fixtures ─────────────────────────────────────────────────────
const REGULAR = {
  id: 'greek-salad', name: 'Greek Salad',
  size: 'Regular', addOns: [],
  quantity: 1, unitPrice: 12.99, itemTotal: 12.99,
};

const LARGE_FETA = {
  id: 'greek-salad', name: 'Greek Salad',
  size: 'Large', addOns: ['Extra Feta'],
  quantity: 2, unitPrice: 16.49, itemTotal: 32.98,
};

const BRUSCHETTA = {
  id: 'bruschetta', name: 'Bruschetta',
  size: 'Regular', addOns: [],
  quantity: 1, unitPrice: 5.99, itemTotal: 5.99,
};

// ── test harness ─────────────────────────────────────────────────
function CartHarness() {
  const { items, totalItems, subtotal, addItem, removeItem, updateQty, clearCart } = useCart();
  return (
    <div>
      <span data-testid="total-items">{totalItems}</span>
      <span data-testid="subtotal">{subtotal.toFixed(2)}</span>
      <span data-testid="items-length">{items.length}</span>
      {items.map((item, i) => (
        <div key={i}>
          <span data-testid={`name-${i}`}>{item.name}</span>
          <span data-testid={`qty-${i}`}>{item.quantity}</span>
          <span data-testid={`item-total-${i}`}>{item.itemTotal.toFixed(2)}</span>
          <button onClick={() => removeItem(i)}                    data-testid={`remove-${i}`}>Remove</button>
          <button onClick={() => updateQty(i, item.quantity + 1)} data-testid={`inc-${i}`}>+</button>
          <button onClick={() => updateQty(i, item.quantity - 1)} data-testid={`dec-${i}`}>−</button>
        </div>
      ))}
      <button onClick={() => addItem(REGULAR)}    data-testid="add-regular">Add Regular</button>
      <button onClick={() => addItem(LARGE_FETA)} data-testid="add-large">Add Large+Feta</button>
      <button onClick={() => addItem(BRUSCHETTA)} data-testid="add-bruschetta">Add Bruschetta</button>
      <button onClick={clearCart}                 data-testid="clear">Clear</button>
    </div>
  );
}

function renderCart() {
  return render(<CartProvider><CartHarness /></CartProvider>);
}

const click = (testId) => fireEvent.click(screen.getByTestId(testId));

// ── tests ────────────────────────────────────────────────────────
describe('CartContext', () => {
  test('starts with an empty cart', () => {
    renderCart();
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('0.00');
  });

  test('addItem adds a new entry to the cart', () => {
    renderCart();
    click('add-regular');
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
    expect(screen.getByTestId('name-0')).toHaveTextContent('Greek Salad');
    expect(screen.getByTestId('qty-0')).toHaveTextContent('1');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('12.99');
  });

  test('addItem merges duplicate (same id + size + addOns) into one row', () => {
    renderCart();
    click('add-regular');
    click('add-regular');
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
    expect(screen.getByTestId('qty-0')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('25.98');
  });

  test('addItem keeps separate rows for different configurations of the same dish', () => {
    renderCart();
    click('add-regular');
    click('add-large');
    expect(screen.getByTestId('items-length')).toHaveTextContent('2');
    expect(screen.getByTestId('total-items')).toHaveTextContent('3'); // qty 1 + qty 2
  });

  test('removeItem deletes the entry at the given index', () => {
    renderCart();
    click('add-regular');
    click('add-bruschetta');
    click('remove-0');
    expect(screen.getByTestId('items-length')).toHaveTextContent('1');
    expect(screen.getByTestId('name-0')).toHaveTextContent('Bruschetta');
  });

  test('updateQty recalculates itemTotal using unitPrice', () => {
    renderCart();
    click('add-regular'); // unitPrice 12.99, qty 1
    click('inc-0');       // qty → 2, itemTotal → 25.98
    expect(screen.getByTestId('qty-0')).toHaveTextContent('2');
    expect(screen.getByTestId('item-total-0')).toHaveTextContent('25.98');
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
  });

  test('updateQty clamps minimum quantity to 1', () => {
    renderCart();
    click('add-regular');
    click('dec-0'); // attempt to go below 1
    expect(screen.getByTestId('qty-0')).toHaveTextContent('1');
  });

  test('clearCart empties items, totalItems and subtotal', () => {
    renderCart();
    click('add-regular');
    click('add-bruschetta');
    click('clear');
    expect(screen.getByTestId('items-length')).toHaveTextContent('0');
    expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('0.00');
  });

  test('subtotal is the sum of all itemTotals', () => {
    renderCart();
    click('add-regular');    // 12.99
    click('add-bruschetta'); //  5.99
    expect(screen.getByTestId('subtotal')).toHaveTextContent('18.98');
  });
});
