import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import CheckoutPage from './CheckoutPage';

// ── fixture ───────────────────────────────────────────────────────
const MOCK_ITEM = {
  id: 'greek-salad', name: 'Greek Salad',
  size: 'Regular', addOns: [],
  quantity: 1, unitPrice: 12.99, itemTotal: 12.99,
};

// ── helpers ───────────────────────────────────────────────────────
function CartSeeder({ items }) {
  const { addItem } = useCart();
  return (
    <button data-testid="seed" onClick={() => items.forEach(addItem)}>
      Seed
    </button>
  );
}

function renderCheckout({ items = [MOCK_ITEM], onSuccess = jest.fn(), onBack = jest.fn() } = {}) {
  return render(
    <CartProvider>
      <CartSeeder items={items} />
      <CheckoutPage onSuccess={onSuccess} onBack={onBack} />
    </CartProvider>
  );
}

function change(labelRe, value) {
  fireEvent.change(screen.getByLabelText(labelRe), { target: { value } });
}

function seedCart() {
  fireEvent.click(screen.getByTestId('seed'));
}

// Fills every required field; mode = 'pickup' skips street address
function fillRequiredFields({ mode = 'delivery', street = '123 Main St' } = {}) {
  change(/first name/i,      'Mario');
  change(/last name/i,       'Rossi');
  change(/email/i,           'mario@test.com');
  change(/phone/i,           '+1234567890');
  if (mode === 'delivery') change(/street address/i, street);
  change(/cardholder name/i, 'Mario Rossi');
  change(/card number/i,     '1111 1111 1111 1111');
  change(/expiry/i,          '12/28');
  change(/cvc/i,             '123');
}

// ── tests ─────────────────────────────────────────────────────────
describe('CheckoutPage', () => {
  test('renders Order Method, Contact Details, Delivery Address and Payment sections', () => {
    renderCheckout();
    seedCart();
    expect(screen.getByText(/order method/i)).toBeInTheDocument();
    expect(screen.getByText(/contact details/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery address/i)).toBeInTheDocument();
    // use heading role to avoid matching "Payments are encrypted & secure"
    expect(screen.getByRole('heading', { name: /^payment$/i })).toBeInTheDocument();
  });

  test('PAY button is disabled when the form is empty', () => {
    renderCheckout();
    seedCart();
    expect(screen.getByRole('button', { name: /pay & confirm/i })).toBeDisabled();
  });

  test('shows Delivery Address section by default (Delivery selected)', () => {
    renderCheckout();
    seedCart();
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
  });

  test('hides Delivery Address section when Pickup is selected', () => {
    renderCheckout();
    seedCart();
    fireEvent.click(screen.getByRole('button', { name: /pickup/i }));
    expect(screen.queryByLabelText(/street address/i)).not.toBeInTheDocument();
  });

  test('PAY button enables when all required fields are filled (Pickup)', () => {
    renderCheckout();
    seedCart();
    fireEvent.click(screen.getByRole('button', { name: /pickup/i }));
    fillRequiredFields({ mode: 'pickup' });
    expect(screen.getByRole('button', { name: /pay & confirm/i })).toBeEnabled();
  });

  test('PAY button stays disabled when Delivery is selected but Street Address is empty', () => {
    renderCheckout();
    seedCart();
    // Delivery is the default — fill everything except street address
    fillRequiredFields({ mode: 'pickup' }); // skips street address
    expect(screen.getByRole('button', { name: /pay & confirm/i })).toBeDisabled();
  });

  test('PAY button calls onSuccess after the processing delay', async () => {
    const onSuccess = jest.fn();
    renderCheckout({ onSuccess });
    seedCart();
    fireEvent.click(screen.getByRole('button', { name: /pickup/i }));
    fillRequiredFields({ mode: 'pickup' });
    fireEvent.click(screen.getByRole('button', { name: /pay & confirm/i }));
    // wait up to 3 s for the 1.6 s processing timer to fire
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1), { timeout: 3000 });
  });
});
