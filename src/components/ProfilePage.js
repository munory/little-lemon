import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MOCK_RESERVATION = {
  id:      'RES-2847',
  date:    'July 12, 2026',
  time:    '7:30 PM',
  guests:  2,
  seating: 'Outdoors',
};

const MOCK_ORDERS = [
  {
    id:    '#LL-8061',
    date:  'June 28, 2026',
    total: '$34.50',
    items: ['1× Bruschetta', '1× Lemon Dessert', '2× Fresh Lemonade'],
  },
  {
    id:    '#LL-7934',
    date:  'June 14, 2026',
    total: '$52.00',
    items: ['1× Grilled Chicken', '1× Creamy Hummus', '1× Classic Limoncello'],
  },
];

function ProfilePage({ onNavigate }) {
  const { user, logout } = useAuth();

  /* ── Profile form ── */
  const profileInit = {
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    email:     user?.email     || '',
    phone:     user?.phone     || '',
  };
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(profileInit);
  const [savedProfile, setSavedProfile] = useState(profileInit);

  const onProfileChange = (field) => (e) =>
    setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleProfileSave = () => { setSavedProfile({ ...profileForm }); setIsEditingProfile(false); };
  const handleProfileCancel = () => { setProfileForm({ ...savedProfile }); setIsEditingProfile(false); };

  /* ── Address form ── */
  const addressInit = {
    street: user?.address?.street || '',
    apt:    user?.address?.apt    || '',
  };
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(addressInit);
  const [savedAddress, setSavedAddress] = useState(addressInit);

  const onAddressChange = (field) => (e) =>
    setAddressForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleAddressSave = () => { setSavedAddress({ ...addressForm }); setIsEditingAddress(false); };
  const handleAddressCancel = () => { setAddressForm({ ...savedAddress }); setIsEditingAddress(false); };

  /* ── Payment form ── */
  const paymentInit = {
    cardName:   user?.payment?.cardName   || '',
    cardNumber: user?.payment?.cardNumber || '',
    expiry:     user?.payment?.expiry     || '',
  };
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState(paymentInit);
  const [savedPayment, setSavedPayment] = useState(paymentInit);

  const onPaymentChange = (field) => (e) =>
    setPaymentForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePaymentSave = () => { setSavedPayment({ ...paymentForm }); setIsEditingPayment(false); };
  const handlePaymentCancel = () => { setPaymentForm({ ...savedPayment }); setIsEditingPayment(false); };

  /* ── Reservation cancel ── */
  const [resCancelled, setResCancelled] = useState(false);

  const handleLogout = () => { logout(); onNavigate('home'); };

  return (
    <main className="profile-dashboard">
      <div className="profile-dashboard-inner">

        <h1 className="profile-dashboard-title">My Account</h1>

        <div className="profile-dashboard-grid">

          {/* ═══════════════════════════════════
              LEFT COLUMN
          ═══════════════════════════════════ */}
          <div className="profile-left-col">

            {/* Card 1 — Profile Settings */}
            <section className="pd-card" aria-label="Profile settings">
              <div className="pd-card-header">
                <p className="pd-card-label">Profile Settings</p>
              </div>
              <div className="pd-card-body">
                <div className="ps-avatar-row">
                  <div className="ps-avatar" aria-hidden="true">
                    {(savedProfile.firstName[0] || 'U').toUpperCase()}
                  </div>
                  <div>
                    <p className="ps-display-name">{savedProfile.firstName} {savedProfile.lastName}</p>
                    <p className="ps-member-since">Member since 2026</p>
                  </div>
                </div>

                <form className="ps-form" onSubmit={(e) => { e.preventDefault(); handleProfileSave(); }}>
                  <div className="ps-field-row">
                    <div className="ps-field">
                      <label htmlFor="pf-first">First Name</label>
                      <input id="pf-first" type="text" value={profileForm.firstName}
                        onChange={onProfileChange('firstName')} disabled={!isEditingProfile} />
                    </div>
                    <div className="ps-field">
                      <label htmlFor="pf-last">Last Name</label>
                      <input id="pf-last" type="text" value={profileForm.lastName}
                        onChange={onProfileChange('lastName')} disabled={!isEditingProfile} />
                    </div>
                  </div>
                  <div className="ps-field">
                    <label htmlFor="pf-email">Email</label>
                    <input id="pf-email" type="email" value={profileForm.email}
                      onChange={onProfileChange('email')} disabled={!isEditingProfile} />
                  </div>
                  <div className="ps-field">
                    <label htmlFor="pf-phone">Phone</label>
                    <input id="pf-phone" type="tel" value={profileForm.phone}
                      placeholder={isEditingProfile ? '+1 (312) 555-0000' : 'Not set'}
                      onChange={onProfileChange('phone')} disabled={!isEditingProfile} />
                  </div>
                  {!isEditingProfile ? (
                    <button type="button" className="ps-edit-btn" onClick={() => setIsEditingProfile(true)}>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="ps-edit-actions">
                      <button type="submit" className="ps-save-btn">Save Changes</button>
                      <button type="button" className="ps-cancel-btn" onClick={handleProfileCancel}>Cancel</button>
                    </div>
                  )}
                </form>

                <button className="ps-logout-btn" onClick={handleLogout}>Log Out</button>
              </div>
            </section>

            {/* Card 2 — Saved Address */}
            <section className="pd-card" aria-label="Saved address">
              <div className="pd-card-header">
                <p className="pd-card-label">Saved Address</p>
              </div>
              <div className="pd-card-body">
                {isEditingAddress ? (
                  <form className="ps-form" onSubmit={(e) => { e.preventDefault(); handleAddressSave(); }}>
                    <div className="ps-field">
                      <label htmlFor="pa-street">Street Address</label>
                      <input id="pa-street" type="text" value={addressForm.street}
                        onChange={onAddressChange('street')} placeholder="1250 N Dearborn St" />
                    </div>
                    <div className="ps-field">
                      <label htmlFor="pa-apt">Apt / Suite</label>
                      <input id="pa-apt" type="text" value={addressForm.apt}
                        onChange={onAddressChange('apt')} placeholder="Apt 4B" />
                    </div>
                    <div className="ps-edit-actions">
                      <button type="submit" className="ps-save-btn">Save</button>
                      <button type="button" className="ps-cancel-btn" onClick={handleAddressCancel}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="pd-info-row">
                    <div className="pd-info-text">
                      <p className="pd-info-primary">{savedAddress.street || '—'}</p>
                      <p className="pd-info-secondary">{savedAddress.apt}</p>
                    </div>
                    <button className="pd-ghost-btn" onClick={() => setIsEditingAddress(true)}>Edit</button>
                  </div>
                )}
              </div>
            </section>

            {/* Card 3 — Payment Methods */}
            <section className="pd-card" aria-label="Payment methods">
              <div className="pd-card-header">
                <p className="pd-card-label">Payment Methods</p>
              </div>
              <div className="pd-card-body">
                {isEditingPayment ? (
                  <form className="ps-form" onSubmit={(e) => { e.preventDefault(); handlePaymentSave(); }}>
                    <div className="ps-field">
                      <label htmlFor="pp-name">Cardholder Name</label>
                      <input id="pp-name" type="text" value={paymentForm.cardName}
                        onChange={onPaymentChange('cardName')} placeholder="Mario Rossi" />
                    </div>
                    <div className="ps-field">
                      <label htmlFor="pp-number">Card Number</label>
                      <input id="pp-number" type="text" value={paymentForm.cardNumber}
                        onChange={onPaymentChange('cardNumber')} placeholder="4242 4242 4242 4242" maxLength={19} />
                    </div>
                    <div className="ps-field">
                      <label htmlFor="pp-expiry">Expiry (MM/YY)</label>
                      <input id="pp-expiry" type="text" value={paymentForm.expiry}
                        onChange={onPaymentChange('expiry')} placeholder="12/28" maxLength={5} />
                    </div>
                    <div className="ps-edit-actions">
                      <button type="submit" className="ps-save-btn">Save</button>
                      <button type="button" className="ps-cancel-btn" onClick={handlePaymentCancel}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="pd-info-row">
                    <div className="pd-info-text pd-info-card">
                      <span className="pd-card-chip" aria-hidden="true">
                        <svg width="28" height="20" viewBox="0 0 32 22" fill="none" aria-hidden="true">
                          <rect width="32" height="22" rx="3" fill="#1a1f71"/>
                          <rect x="1" y="7" width="30" height="8" fill="#f7b600"/>
                          <text x="16" y="18" fontSize="6" fill="#fff" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">VISA</text>
                        </svg>
                      </span>
                      <div>
                        <p className="pd-info-primary">Visa ending in {savedPayment.cardNumber?.slice(-4) || '4242'}</p>
                        <p className="pd-info-secondary">Expires {savedPayment.expiry}</p>
                      </div>
                    </div>
                    <button className="pd-ghost-btn" onClick={() => setIsEditingPayment(true)}>Edit</button>
                  </div>
                )}
              </div>
            </section>

          </div>{/* /profile-left-col */}

          {/* ═══════════════════════════════════
              RIGHT COLUMN — Reservations + Orders
          ═══════════════════════════════════ */}
          <div className="profile-right-col">

            {/* Upcoming Reservations */}
            <section className="pd-card" aria-label="Upcoming reservations">
              <div className="pd-card-header">
                <p className="pd-card-label">Upcoming Reservations</p>
              </div>
              <div className="pd-card-body">
                {resCancelled ? (
                  <p className="pd-empty">No upcoming reservations.</p>
                ) : (
                  <div className="res-row">
                    <div className="res-info">
                      <p className="res-date">
                        {MOCK_RESERVATION.date}&ensp;·&ensp;{MOCK_RESERVATION.time}
                      </p>
                      <ul className="res-meta">
                        <li>{MOCK_RESERVATION.guests} Guests</li>
                        <li>{MOCK_RESERVATION.seating}</li>
                        <li>Ref: {MOCK_RESERVATION.id}</li>
                      </ul>
                    </div>
                    <div className="res-actions">
                      <span className="res-badge res-badge--confirmed">Confirmed</span>
                      <button className="res-cancel-btn" onClick={() => setResCancelled(true)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Order History */}
            <section className="pd-card" aria-label="Order history">
              <div className="pd-card-header">
                <p className="pd-card-label">Order History</p>
              </div>
              <div className="pd-card-body">
                <ul className="order-list">
                  {MOCK_ORDERS.map((order) => (
                    <li key={order.id} className="order-row">
                      <div className="order-info">
                        <div className="order-header-row">
                          <span className="order-id">{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <p className="order-total">{order.total}</p>
                        <p className="order-items">{order.items.join('  ·  ')}</p>
                      </div>
                      <button className="order-reorder-btn" onClick={() => onNavigate('menu')}>
                        Reorder
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
