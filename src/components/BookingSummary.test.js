import { render, screen, fireEvent } from '@testing-library/react';
import BookingSummary from './BookingSummary';

const mockBookingData = {
  date: '2099-12-31',
  time: '19:00',
  guests: 3,
  occasion: 'Birthday',
  seating: 'indoors',
  specialRequests: '',
};

const mockProps = {
  bookingData: mockBookingData,
  onConfirm: jest.fn(),
  onBack: jest.fn(),
};

describe('BookingSummary', () => {
  test('renders "Reservation Summary" heading', () => {
    render(<BookingSummary {...mockProps} />);
    expect(screen.getByText('Reservation Summary')).toBeInTheDocument();
  });

  test('displays guests count from booking data', () => {
    render(<BookingSummary {...mockProps} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('Confirm button is disabled when contact form is empty', () => {
    render(<BookingSummary {...mockProps} />);
    expect(screen.getByText('Confirm Reservation')).toBeDisabled();
  });

  test('Confirm button enables after filling required contact fields', () => {
    render(<BookingSummary {...mockProps} />);
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Anna' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Smith' } });
    fireEvent.change(screen.getByLabelText(/email/i),      { target: { value: 'anna@example.com' } });
    expect(screen.getByText('Confirm Reservation')).not.toBeDisabled();
  });
});
