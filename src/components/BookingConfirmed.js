import { useMemo } from 'react';
import restaurantChef from '../assets/restaurant chef B.jpg';

function BookingConfirmed({ reservationData, onBackHome, onViewMenu }) {
  const { firstName = 'Guest', date = '', time = '', guests = 2 } = reservationData || {};

  const bookingRef = useMemo(() => `LL-${Math.floor(1000 + Math.random() * 9000)}`, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <main className="confirmed-page" aria-label="Reservation confirmed">

      {/* Фото с иконкой успеха */}
      <div className="confirmed-image-wrap">
        <img
          className="confirmed-image"
          src={restaurantChef}
          alt="Little Lemon restaurant"
        />
        <div className="confirmed-check" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <section className="confirmed-content">
        <h1 className="confirmed-heading">Reservation Confirmed!</h1>
        <p className="confirmed-subtext">
          Thank you, <strong>{firstName}</strong>! We look forward to welcoming you.<br />
          A confirmation has been sent to your email.
        </p>

        {/* Ticket-карточка */}
        <div className="confirmed-ticket" role="region" aria-label="Booking details">
          <div className="confirmed-ticket-row">
            <span className="ticket-label">Date</span>
            <span className="ticket-value">{formatDate(date)}</span>
          </div>
          <div className="confirmed-ticket-row">
            <span className="ticket-label">Time</span>
            <span className="ticket-value">{time || '—'}</span>
          </div>
          <div className="confirmed-ticket-row">
            <span className="ticket-label">Guests</span>
            <span className="ticket-value">{guests}</span>
          </div>
          <div className="confirmed-ticket-divider" />
          <div className="confirmed-ticket-row">
            <span className="ticket-label">Booking Ref</span>
            <span className="ticket-value ticket-ref">#{bookingRef}</span>
          </div>
        </div>

        <div className="confirmed-actions">
          <button className="btn-primary" onClick={onBackHome}>Home</button>
          <button className="btn-outline" onClick={onViewMenu}>View Menu</button>
        </div>
      </section>

    </main>
  );
}

export default BookingConfirmed;
