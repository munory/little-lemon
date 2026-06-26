import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import BookingSummary from './BookingSummary';

const mockBookingData = {
  date: '2099-12-31',
  time: '19:00',
  guests: 3,
  occasion: 'Birthday',
  seating: 'indoors',
  specialRequests: '',
};

const emptyContact = { firstName: '', lastName: '', email: '', phone: '' };

// Wrapper to give BookingSummary a real contact state so fireEvent tests work
function SummaryWithState({ contact: initialContact = emptyContact, ...rest }) {
  const [contact, setContact] = useState(initialContact);
  return (
    <BookingSummary
      {...rest}
      contact={contact}
      onContactChange={(field, value) => setContact((prev) => ({ ...prev, [field]: value }))}
    />
  );
}

const baseProps = {
  bookingData: mockBookingData,
  onBookingDataSave: jest.fn(),
  onConfirm: jest.fn(),
  onBack: jest.fn(),
};

describe('BookingSummary', () => {
  test('renders "Reservation Summary" heading', () => {
    render(<SummaryWithState {...baseProps} />);
    expect(screen.getByText('Reservation Summary')).toBeInTheDocument();
  });

  test('displays guests count from booking data', () => {
    render(<SummaryWithState {...baseProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('Confirm button is disabled when contact form is empty', () => {
    render(<SummaryWithState {...baseProps} />);
    expect(screen.getByText('Confirm Reservation')).toBeDisabled();
  });

  test('Confirm button enables after filling required contact fields', () => {
    render(<SummaryWithState {...baseProps} />);
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Anna' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/email/i),      { target: { value: 'anna@example.com' } });
    expect(screen.getByText('Confirm Reservation')).not.toBeDisabled();
  });
});
