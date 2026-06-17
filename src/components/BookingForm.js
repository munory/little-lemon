import { useState, useRef, useReducer } from 'react';
import heroImage from '../assets/restaurant.jpg';
import { initializeTimes, updateTimes } from '../utils/bookingUtils';

const OCCASIONS = ['Birthday', 'Anniversary', 'Date', 'Business meal', 'Other'];

function BookingForm({ draft, onContinue, onBack }) {
  const today = new Date().toISOString().split('T')[0];

  const initialDate = draft?.date ? new Date(draft.date + 'T00:00:00') : new Date();
  const [availableTimes, dispatch] = useReducer(updateTimes, initialDate, initializeTimes);

  const [date, setDate] = useState(draft?.date ?? '');
  const [time, setTime] = useState(draft?.time ?? '');
  const [formData, setFormData] = useState({
    guests: draft?.guests ?? 2,
    seating: draft?.seating ?? 'indoors',
    occasion: draft?.occasion ?? '',
    specialRequests: draft?.specialRequests ?? '',
  });
  const [occasionOpen, setOccasionOpen] = useState(false);

  const dateInputRef = useRef(null);
  const set = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const isFormValid = date && time;

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    setTime('');
    if (newDate) {
      dispatch({ date: new Date(newDate + 'T00:00:00') });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(
      { ...formData, date, time },
      { date, time, ...formData }
    );
  };

  return (
    <main className="booking-page">
      <div className="booking-split-right">

        <h2 className="booking-page-title">Reserve a Table</h2>

        <div className="booking-hero-banner">
          <img src={heroImage} alt="Little Lemon restaurant interior" />
        </div>

        <form className="booking-form" onSubmit={handleSubmit} aria-label="Table reservation form">

          {/* DATE */}
          <div className="booking-section">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <div className="input-icon-wrap">
                <input
                  ref={dateInputRef}
                  type="date"
                  id="date"
                  min={today}
                  value={date}
                  onChange={handleDateChange}
                  required
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  aria-label="Open calendar"
                  onClick={() => dateInputRef.current?.showPicker()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* TIME */}
          <div className="booking-section">
            <div className="form-group">
              <label htmlFor="time">Time</label>
              {availableTimes.length > 0 ? (
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              ) : (
                <p className="field-error">No available times for this date</p>
              )}
            </div>
          </div>

          {/* GUESTS */}
          <div className="booking-section">
            <div className="form-group">
              <label htmlFor="guests">Guests</label>
              <div className="guests-counter" role="group" aria-label="Number of guests">
                <button type="button" aria-label="Decrease guests"
                  onClick={() => set('guests', Math.max(1, formData.guests - 1))}>−</button>
                <span aria-live="polite">{formData.guests}</span>
                <button type="button" aria-label="Increase guests"
                  onClick={() => set('guests', Math.min(20, formData.guests + 1))}>+</button>
              </div>
            </div>
          </div>

          {/* SEATING */}
          <div className="booking-section">
            <div className="form-group">
              <label id="seating-label">Seating Preference</label>
              <div className="seating-toggle" role="group" aria-labelledby="seating-label">
                <button
                  type="button"
                  className={formData.seating === 'indoors' ? 'active' : ''}
                  aria-pressed={formData.seating === 'indoors'}
                  onClick={() => set('seating', 'indoors')}
                >Indoors</button>
                <button
                  type="button"
                  className={formData.seating === 'outdoors' ? 'active' : ''}
                  aria-pressed={formData.seating === 'outdoors'}
                  onClick={() => set('seating', 'outdoors')}
                >Outdoors</button>
              </div>
            </div>
          </div>

          {/* OCCASION */}
          <div className="booking-section">
            <div className="form-group">
              <label>Occasion</label>
              <div className="occasion-dropdown">
                <button
                  type="button"
                  className={`occasion-trigger${formData.occasion ? ' occasion-trigger--selected' : ''}`}
                  onClick={() => setOccasionOpen(!occasionOpen)}
                  aria-expanded={occasionOpen}
                  aria-haspopup="listbox"
                >
                  <span className="occasion-trigger-label">
                    {formData.occasion || 'Select occasion'}
                  </span>
                  <span className="occasion-chevron">{occasionOpen ? '▲' : '▼'}</span>
                </button>
                {occasionOpen && (
                  <ul className="occasion-list" role="listbox">
                    {OCCASIONS.map((o) => (
                      <li key={o} role="option" aria-selected={formData.occasion === o}>
                        <button
                          type="button"
                          className={`occasion-option${formData.occasion === o ? ' active' : ''}`}
                          onClick={() => { set('occasion', o); setOccasionOpen(false); }}
                        >
                          {o}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* SPECIAL REQUESTS */}
          <div className="booking-section booking-section--last">
            <div className="form-group">
              <label htmlFor="specialRequests">Special Requests</label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                rows="4"
                placeholder="Any dietary requirements or special requests..."
                value={formData.specialRequests}
                onChange={(e) => set('specialRequests', e.target.value)}
              />
            </div>
          </div>

          <div className="booking-actions">
            <button
              type="button"
              className="btn-booking-back"
              onClick={() => onBack({ date, time, ...formData })}
            >
              Back
            </button>
            <button type="submit" className="btn-booking-submit" disabled={!isFormValid}>
              Continue
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

export default BookingForm;
