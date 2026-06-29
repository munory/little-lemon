import { useState, useMemo, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { RESTAURANT } from '../constants';

const TAX_RATE  = 0.08;
const DELIVERY_FEE = 5.00;

function CheckoutPage({ onSuccess, onBack }) {
  const { items, subtotal, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();

  const [orderMethod, setOrderMethod] = useState('delivery');
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [address, setAddress] = useState({ street: '', apt: '', instructions: '' });
  const [payment, setPayment] = useState({ cardholderName: '', cardNumber: '', expiry: '', cvc: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [autofillDismissed, setAutofillDismissed] = useState(false);

  const handleAutofill = useCallback(() => {
    setContact({
      firstName: user?.firstName || '',
      lastName:  user?.lastName  || '',
      email:     user?.email     || '',
      phone:     user?.phone     || '',
    });
    setAddress({
      street:       user?.address?.street || '',
      apt:          user?.address?.apt    || '',
      instructions: '',
    });
    setPayment({
      cardholderName: user?.payment?.cardName   || '',
      cardNumber:     user?.payment?.cardNumber || '',
      expiry:         user?.payment?.expiry     || '',
      cvc:            user?.payment?.cvc || '',
    });
    setAutofillDismissed(true);
  }, [user]);

  const isDelivery  = orderMethod === 'delivery';
  const deliveryFee = isDelivery ? DELIVERY_FEE : 0;
  const taxes       = parseFloat((subtotal * TAX_RATE).toFixed(2));
  const total       = parseFloat((subtotal + taxes + deliveryFee).toFixed(2));

  const isFormValid = useMemo(() => {
    const contactOk = contact.firstName.trim() && contact.lastName.trim() && contact.email.trim() && contact.phone.trim();
    const addressOk = !isDelivery || address.street.trim();
    const paymentOk = payment.cardholderName.trim()
      && payment.cardNumber.replace(/\s/g, '').length === 16
      && payment.expiry.length === 5
      && payment.cvc.length === 3;
    return !!(contactOk && addressOk && paymentOk) && items.length > 0;
  }, [contact, address, payment, isDelivery, items.length]);

  const setContactField = useCallback((field) => (e) =>
    setContact((prev) => ({ ...prev, [field]: e.target.value })), []);

  const setAddressField = useCallback((field) => (e) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value })), []);

  const handleCardNumber = (e) => {
    const raw       = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
    setPayment((p) => ({ ...p, cardNumber: formatted }));
  };

  const handleExpiry = (e) => {
    const raw       = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
    setPayment((p) => ({ ...p, expiry: formatted }));
  };

  const handlePay = async () => {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1600));
    clearCart();
    onSuccess();
  };

  const displayNumber = payment.cardNumber || '•••• •••• •••• ••••';

  return (
    <main className="checkout-page">
      <div className="checkout-inner">

        {/* ── Left column ── */}
        <div className="checkout-left">
          <h1 className="checkout-title">Checkout</h1>

          {/* Autofill prompt — logged-in users only */}
          {isLoggedIn && !autofillDismissed && (
            <div className="co-autofill-prompt" role="region" aria-label="Autofill suggestion">
              <div className="co-autofill-avatar" aria-hidden="true">
                {user.firstName[0].toUpperCase()}
              </div>
              <div className="co-autofill-info">
                <p className="co-autofill-name">{user.firstName} {user.lastName}</p>
                <p className="co-autofill-detail">{user.email}</p>
              </div>
              <div className="co-autofill-actions">
                <button className="co-autofill-apply" onClick={handleAutofill}>
                  Apply my details
                </button>
                <button className="co-autofill-skip" onClick={() => setAutofillDismissed(true)}>
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* A — Order Method */}
          <section className="co-card" aria-labelledby="co-method-heading">
            <h2 className="co-card-title" id="co-method-heading">Order Method</h2>
            <div className="co-method-toggle" role="group" aria-label="Order method">
              <button
                className={`co-method-btn${isDelivery ? ' active' : ''}`}
                onClick={() => setOrderMethod('delivery')}
                aria-pressed={isDelivery}
              >
                <span aria-hidden="true">🛵</span> Delivery
              </button>
              <button
                className={`co-method-btn${!isDelivery ? ' active' : ''}`}
                onClick={() => setOrderMethod('pickup')}
                aria-pressed={!isDelivery}
              >
                <span aria-hidden="true">🏪</span> Pickup
              </button>
            </div>
            {!isDelivery && (
              <p className="co-pickup-note">
                Ready in ~20 min · <strong>{RESTAURANT.fullAddress}</strong>
              </p>
            )}
          </section>

          {/* B — Contact Details */}
          <section className="co-card" aria-labelledby="co-contact-heading">
            <h2 className="co-card-title" id="co-contact-heading">Contact Details</h2>
            <div className="co-row">
              <div className="form-group">
                <label htmlFor="co-first-name">First Name <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-first-name" type="text" className="co-input" value={contact.firstName} onChange={setContactField('firstName')} placeholder="Mario" autoComplete="given-name" required />
              </div>
              <div className="form-group">
                <label htmlFor="co-last-name">Last Name <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-last-name" type="text" className="co-input" value={contact.lastName} onChange={setContactField('lastName')} placeholder="Rossi" autoComplete="family-name" required />
              </div>
            </div>
            <div className="co-row">
              <div className="form-group">
                <label htmlFor="co-email">Email <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-email" type="email" className="co-input" value={contact.email} onChange={setContactField('email')} placeholder="mario@example.com" autoComplete="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="co-phone">Phone <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-phone" type="tel" className="co-input" value={contact.phone} onChange={setContactField('phone')} placeholder="+1 (312) 000-0000" autoComplete="tel" required />
              </div>
            </div>
          </section>

          {/* C — Delivery Address (conditional) */}
          {isDelivery && (
            <section className="co-card" aria-labelledby="co-address-heading">
              <h2 className="co-card-title" id="co-address-heading">Delivery Address</h2>
              <div className="form-group">
                <label htmlFor="co-street">Street Address <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-street" type="text" className="co-input" value={address.street} onChange={setAddressField('street')} placeholder={RESTAURANT.street} autoComplete="street-address" required />
              </div>
              <div className="form-group">
                <label htmlFor="co-apt">Apt / Suite</label>
                <input id="co-apt" type="text" className="co-input" value={address.apt} onChange={setAddressField('apt')} placeholder="Apt 4B" autoComplete="address-line2" />
              </div>
              <div className="form-group">
                <label htmlFor="co-instructions">Delivery Instructions</label>
                <textarea id="co-instructions" className="co-input co-textarea" value={address.instructions} onChange={setAddressField('instructions')} placeholder="Leave at door, ring bell, call on arrival…" rows={3} maxLength={200} />
              </div>
            </section>
          )}

          {/* D — Payment */}
          <section className="co-card" aria-labelledby="co-payment-heading">
            <h2 className="co-card-title" id="co-payment-heading">Payment</h2>

            <div className="co-mock-card" aria-hidden="true">
              <div className="co-mock-card-deco-1" />
              <div className="co-mock-card-deco-2" />
              <div className="co-mock-chip" />
              <div className="co-mock-number">{displayNumber}</div>
              <div className="co-mock-bottom">
                <div className="co-mock-field">
                  <span className="co-mock-label">Cardholder</span>
                  <span className="co-mock-value">{payment.cardholderName || 'YOUR NAME'}</span>
                </div>
                <div className="co-mock-field co-mock-field--right">
                  <span className="co-mock-label">Expires</span>
                  <span className="co-mock-value">{payment.expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="co-cardholder">Cardholder Name <span className="required-mark" aria-hidden="true">*</span></label>
              <input id="co-cardholder" type="text" className="co-input" value={payment.cardholderName} onChange={(e) => setPayment((p) => ({ ...p, cardholderName: e.target.value }))} placeholder="Mario Rossi" autoComplete="cc-name" required />
            </div>
            <div className="form-group">
              <label htmlFor="co-card-number">Card Number <span className="required-mark" aria-hidden="true">*</span></label>
              <input id="co-card-number" type="text" inputMode="numeric" className="co-input co-input--mono" value={payment.cardNumber} onChange={handleCardNumber} placeholder="1234 5678 9012 3456" maxLength={19} autoComplete="cc-number" required />
            </div>
            <div className="co-row co-row--narrow">
              <div className="form-group">
                <label htmlFor="co-expiry">Expiry (MM/YY) <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-expiry" type="text" inputMode="numeric" className="co-input co-input--mono" value={payment.expiry} onChange={handleExpiry} placeholder="08/27" maxLength={5} autoComplete="cc-exp" required />
              </div>
              <div className="form-group">
                <label htmlFor="co-cvc">CVC <span className="required-mark" aria-hidden="true">*</span></label>
                <input id="co-cvc" type="text" inputMode="numeric" className="co-input co-input--mono" value={payment.cvc} onChange={(e) => setPayment((p) => ({ ...p, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))} placeholder="123" maxLength={3} autoComplete="cc-csc" required />
              </div>
            </div>
          </section>
        </div>

        {/* ── Right column — Order Summary ── */}
        <aside className="checkout-right">
          <div className="co-summary-box">
            <h2 className="co-summary-title">Order Summary</h2>

            {items.length === 0 ? (
              <p className="co-summary-empty">Your cart is empty.</p>
            ) : (
              <ul className="co-item-list">
                {items.map((item, i) => (
                  <li key={`${item.id}-${i}`} className="co-item-row">
                    <span className="co-item-name">
                      {item.name}
                      <span className="co-item-qty"> ×{item.quantity}</span>
                    </span>
                    <span className="co-item-price">${item.itemTotal.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="co-divider" />

            <div className="co-calcs">
              <div className="co-calc-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="co-calc-row">
                <span>Tax (8%)</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="co-calc-row">
                <span>Delivery Fee</span>
                <span className={!isDelivery ? 'co-calc-free' : ''}>{isDelivery ? `$${DELIVERY_FEE.toFixed(2)}` : 'Free'}</span>
              </div>
              <div className="co-divider" />
              <div className="co-calc-row co-calc-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className={`co-pay-btn${isLoading ? ' co-pay-btn--loading' : ''}`}
              onClick={handlePay}
              disabled={!isFormValid || isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="co-spinner" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                <>
                  Pay & Confirm Order
                  <span className="co-pay-total"> — ${total.toFixed(2)}</span>
                </>
              )}
            </button>

            <p className="co-secure-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Payments are encrypted &amp; secure
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}

export default CheckoutPage;
