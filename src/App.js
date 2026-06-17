import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import BookingForm from './components/BookingForm';
import BookingSummary from './components/BookingSummary';
import BookingConfirmed from './components/BookingConfirmed';

function App() {
  const [page, setPage] = useState('home');
  const [reservationData, setReservationData] = useState({});
  const [bookingDraft, setBookingDraft] = useState(null);

  const handleBookingContinue = (formData, draft) => {
    setBookingDraft(draft);
    setReservationData(formData);
    setPage('summary');
  };

  const handleConfirm = (fullData) => {
    setReservationData(fullData);
    setPage('confirmed');
  };

  return (
    <>
      <Header onNavigate={setPage} />

      {page === 'home' && (
        <Main onReserve={() => setPage('booking')} />
      )}

      {page === 'booking' && (
        <BookingForm
          draft={bookingDraft}
          onContinue={handleBookingContinue}
          onBack={(draft) => { setBookingDraft(draft); setPage('home'); }}
        />
      )}

      {page === 'summary' && (
        <BookingSummary
          bookingData={reservationData}
          onConfirm={handleConfirm}
          onBack={() => setPage('booking')}
        />
      )}

      {page === 'confirmed' && (
        <BookingConfirmed
          reservationData={reservationData}
          onBackHome={() => setPage('home')}
          onViewMenu={() => setPage('home')}
        />
      )}

      <Footer />
    </>
  );
}

export default App;
