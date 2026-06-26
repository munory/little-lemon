import { useState } from 'react';
import BookingForm from './BookingForm';
import BookingSummary from './BookingSummary';

function ReservationFlow({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);

  // Step 1 state — lives here so Back from step 2 never loses it
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState('indoors');
  const [occasion, setOccasion] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 2 state — same reason
  const [contact, setContact] = useState({ firstName: '', lastName: '', email: '', phone: '' });

  const step1Data = { date, time, guests, seating, occasion, specialRequests };

  const handleBookingDataSave = (updated) => {
    setDate(updated.date);
    setTime(updated.time);
    setGuests(updated.guests);
    setSeating(updated.seating);
    setOccasion(updated.occasion ?? '');
    setSpecialRequests(updated.specialRequests ?? '');
  };

  const handleContactChange = (field, value) =>
    setContact((prev) => ({ ...prev, [field]: value }));

  if (step === 1) {
    return (
      <BookingForm
        date={date}
        onDateChange={setDate}
        time={time}
        onTimeChange={setTime}
        guests={guests}
        onGuestsChange={setGuests}
        seating={seating}
        onSeatingChange={setSeating}
        occasion={occasion}
        onOccasionChange={setOccasion}
        specialRequests={specialRequests}
        onSpecialRequestsChange={setSpecialRequests}
        onContinue={() => setStep(2)}
        onBack={onCancel}
      />
    );
  }

  return (
    <BookingSummary
      bookingData={step1Data}
      onBookingDataSave={handleBookingDataSave}
      contact={contact}
      onContactChange={handleContactChange}
      onConfirm={() => onComplete({ ...step1Data, ...contact })}
      onBack={() => setStep(1)}
    />
  );
}

export default ReservationFlow;
