import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import CartDrawer from './CartDrawer';

// ── fixtures ─────────────────────────────────────────────────────
const ITEM_A = {
  id: 'greek-salad', name: 'Greek Salad',
  size: 'Regular', addOns: [],
  quantity: 1, unitPrice: 12.99, itemTotal: 12.99,
};

const ITEM_B = {
  id: 'bruschetta', name: 'Bruschetta',
  size: 'Regular', addOns: [],
  quantity: 2, unitPrice: 5.99, itemTotal: 11.98,
};

// ── harness ───────────────────────────────────────────────────────
// Seeds the cart with given items, then opens the drawer
function DrawerHarness({ items = [], onCheckout = jest.fn() }) {
  const { addItem, openDrawer } = useCart();
  const open = () => { items.forEach(addItem); openDrawer(); };
  return (
    <>
      <button data-testid="open" onClick={open}>Open</button>
      <CartDrawer onCheckout={onCheckout} />
    </>
  );
}

function renderDrawer({ items = [], onCheckout = jest.fn() } = {}) {
  return render(
    <CartProvider>
      <DrawerHarness items={items} onCheckout={onCheckout} />
    </CartProvider>
  );
}

// ── tests ─────────────────────────────────────────────────────────
describe('CartDrawer', () => {
  test('shows empty-cart message when opened with no items', () => {
    renderDrawer();
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('renders item name, quantity and price', () => {
    renderDrawer({ items: [ITEM_A] });
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByText('Greek Salad')).toBeInTheDocument();
    // qty counter
    expect(screen.getByLabelText(/decrease quantity/i).nextSibling).toHaveTextContent('1');
    // $12.99 appears in both item-price and the subtotal row — both correct
    expect(screen.getAllByText('$12.99').length).toBeGreaterThanOrEqual(1);
  });

  test('remove button deletes the item from the cart', () => {
    renderDrawer({ items: [ITEM_A] });
    fireEvent.click(screen.getByTestId('open'));
    fireEvent.click(screen.getByLabelText(/remove greek salad/i));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test('− button is disabled when item quantity is 1', () => {
    renderDrawer({ items: [ITEM_A] });
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByLabelText(/decrease quantity/i)).toBeDisabled();
  });

  test('+ button increases quantity and updates the item total', () => {
    renderDrawer({ items: [ITEM_A] }); // unitPrice 12.99, qty 1
    fireEvent.click(screen.getByTestId('open'));
    fireEvent.click(screen.getByLabelText(/increase quantity/i));
    // qty counter now shows 2
    expect(screen.getByLabelText(/decrease quantity/i).nextSibling).toHaveTextContent('2');
    // $25.98 appears in item-price and subtotal — both are correct
    expect(screen.getAllByText('$25.98').length).toBeGreaterThanOrEqual(1);
  });

  test('Checkout button calls the onCheckout callback', () => {
    const onCheckout = jest.fn();
    renderDrawer({ items: [ITEM_A], onCheckout });
    fireEvent.click(screen.getByTestId('open'));
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  test('subtotal displays the sum of all item totals', () => {
    renderDrawer({ items: [ITEM_A, ITEM_B] }); // 12.99 + 11.98 = 24.97
    fireEvent.click(screen.getByTestId('open'));
    expect(screen.getByText('$24.97')).toBeInTheDocument();
  });
});
