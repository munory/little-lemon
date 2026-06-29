import { useState, useEffect } from 'react';
import './App.css';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import ReservationFlow from './components/ReservationFlow';
import BookingConfirmed from './components/BookingConfirmed';
import CheckoutPage from './components/CheckoutPage';
import CheckoutSuccess from './components/CheckoutSuccess';
import MenuPage from './components/MenuPage';
import ProfilePage from './components/ProfilePage';
import CartDrawer from './components/CartDrawer';
import CartToast from './components/CartToast';
import { submitReservation } from './utils/bookingUtils';

function App() {
  const [page, setPage] = useState('home');
  const [confirmedData, setConfirmedData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);

  const handleReservationComplete = (fullData) => {
    const success = submitReservation(fullData);
    if (success) {
      setConfirmedData(fullData);
      setPage('confirmed');
    }
  };

  const showFooter = page !== 'checkout' && page !== 'checkout-success' && page !== 'menu';

  return (
    <AuthProvider>
    <CartProvider>
      <Header onNavigate={setPage} currentPage={page} />

      {page === 'home' && (
        <Main onReserve={() => setPage('booking')} onMenu={() => setPage('menu')} />
      )}

      {page === 'menu' && (
        <MenuPage />
      )}

      {page === 'booking' && (
        <ReservationFlow
          onComplete={handleReservationComplete}
          onCancel={() => setPage('home')}
        />
      )}

      {page === 'confirmed' && (
        <BookingConfirmed
          reservationData={confirmedData}
          onBackHome={() => setPage('home')}
          onViewMenu={() => setPage('menu')}
        />
      )}

      {page === 'checkout' && (
        <CheckoutPage
          onSuccess={() => setPage('checkout-success')}
          onBack={() => setPage('home')}
        />
      )}

      {page === 'checkout-success' && (
        <CheckoutSuccess onBackHome={() => setPage('home')} />
      )}

      {page === 'profile' && (
        <ProfilePage onNavigate={setPage} />
      )}

      {showFooter && <Footer onNavigate={setPage} />}
      <CartDrawer onCheckout={() => setPage('checkout')} onBrowseMenu={() => setPage('menu')} />
      <CartToast />
    </CartProvider>
    </AuthProvider>
  );
}

export default App;
