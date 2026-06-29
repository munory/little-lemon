import { useState, useRef, useEffect } from 'react';

const OCCASIONS = ['', 'Birthday', 'Anniversary', 'Date', 'Business meal', 'Other'];
const SEATINGS = ['indoors', 'outdoors'];

function CustomSelect({ value, options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const label = value
    ? options.find((o) => (o.value ?? o) === value)?.label ?? value
    : placeholder;

  return (
    <div className="s-dropdown" ref={ref}>
      <button
        type="button"
        className={`s-dropdown-trigger${value ? ' s-dropdown-trigger--selected' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        <span className="capitalize">{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
        </svg>
      </button>
      {open && (
        <ul className="s-dropdown-list" role="listbox">
          {options.map((o) => {
            const val = o.value ?? o;
            const lbl = o.label ?? o;
            const active = val === value;
            return (
              <li key={val} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`s-dropdown-option${active ? ' active' : ''}`}
                  onClick={() => { onChange(val); setOpen(false); }}
                >
                  {lbl || 'None'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BookingSummary({ bookingData, onBookingDataSave, contact, onContactChange, onConfirm, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({ ...bookingData });

  const today = new Date().toISOString().split('T')[0];
  const setEdit = (field, value) => setEdited((prev) => ({ ...prev, [field]: value }));

  const isFormValid = contact.firstName.trim() && contact.lastName.trim() && contact.email.trim();

  const handleSaveEdits = () => {
    onBookingDataSave(edited);
    setIsEditing(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <main className="booking-page">
      <div className="booking-form-wrapper">
        <div className="summary-card">

          {/* ── RESERVATION SUMMARY ── */}
          <div className="summary-box">
            <div className="summary-box-header">
              <h2>Reservation Summary</h2>
              {!isEditing && (
                <button type="button" className="summary-edit-btn" onClick={() => setIsEditing(true)}>
                  Edit details
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="summary-edit-fields">
                <div className="summary-edit-row">
                  <label htmlFor="s-date">Date</label>
                  <input type="date" id="s-date" min={today} value={edited.date}
                    onChange={(e) => setEdit('date', e.target.value)} />
                </div>
                <div className="summary-edit-row">
                  <label htmlFor="s-time">Time</label>
                  <input type="time" id="s-time" step="1800" value={edited.time}
                    onChange={(e) => setEdit('time', e.target.value)} />
                </div>
                <div className="summary-edit-row">
                  <label htmlFor="s-guests">Guests</label>
                  <input type="number" id="s-guests" min="1" max="20" value={edited.guests}
                    onChange={(e) => setEdit('guests', Number(e.target.value))} />
                </div>
                <div className="summary-edit-row">
                  <label>Seating</label>
                  <CustomSelect
                    value={edited.seating}
                    options={SEATINGS}
                    onChange={(v) => setEdit('seating', v)}
                    placeholder="Select seating"
                  />
                </div>
                <div className="summary-edit-row">
                  <label>Occasion</label>
                  <CustomSelect
                    value={edited.occasion}
                    options={OCCASIONS}
                    onChange={(v) => setEdit('occasion', v)}
                    placeholder="None"
                  />
                </div>
                <button type="button" className="summary-save-btn" onClick={handleSaveEdits}>
                  Save changes
                </button>
              </div>
            ) : (
              <dl className="summary-dl">
                <div className="summary-row"><dt>Date</dt><dd>{formatDate(edited.date)}</dd></div>
                <div className="summary-row"><dt>Time</dt><dd>{edited.time || '—'}</dd></div>
                <div className="summary-row"><dt>Guests</dt><dd>{edited.guests}</dd></div>
                {edited.occasion && <div className="summary-row"><dt>Occasion</dt><dd>{edited.occasion}</dd></div>}
                <div className="summary-row">
                  <dt>Seating</dt>
                  <dd className="capitalize">{edited.seating}</dd>
                </div>
              </dl>
            )}
          </div>

          {/* ── CONTACT FORM ── */}
          <form className="summary-contact-form" onSubmit={handleSubmit} aria-label="Contact details form">
            <h3 className="summary-contact-title">Contact Details</h3>

            <div className="summary-fields-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required-mark">*</span></label>
                <input type="text" id="firstName" value={contact.firstName}
                  onChange={(e) => onContactChange('firstName', e.target.value)} required autoComplete="given-name" />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required-mark">*</span></label>
                <input type="text" id="lastName" value={contact.lastName}
                  onChange={(e) => onContactChange('lastName', e.target.value)} required autoComplete="family-name" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email <span className="required-mark">*</span></label>
              <input type="email" id="email" value={contact.email}
                onChange={(e) => onContactChange('email', e.target.value)} required autoComplete="email" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" value={contact.phone}
                onChange={(e) => onContactChange('phone', e.target.value)} autoComplete="tel" />
            </div>

            <div className="booking-actions">
              <button type="button" className="btn-booking-back" onClick={onBack}>Back</button>
              <button type="submit" className="btn-confirm" disabled={!isFormValid}>
                Confirm Reservation
              </button>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}

export default BookingSummary;
