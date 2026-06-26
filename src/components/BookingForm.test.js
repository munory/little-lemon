import { render, screen, fireEvent } from '@testing-library/react';
import BookingForm from './BookingForm';

const mockProps = {
  date: '',
  onDateChange: jest.fn(),
  time: '',
  onTimeChange: jest.fn(),
  guests: 2,
  onGuestsChange: jest.fn(),
  seating: 'indoors',
  onSeatingChange: jest.fn(),
  occasion: '',
  onOccasionChange: jest.fn(),
  specialRequests: '',
  onSpecialRequestsChange: jest.fn(),
  onContinue: jest.fn(),
  onBack: jest.fn(),
};

beforeEach(() => {
  window.fetchAPI = jest.fn().mockReturnValue(['17:00', '18:00', '19:00', '20:00', '21:00']);
});

describe('BookingForm — rendering', () => {
  test('renders heading "Reserve a Table"', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByText('Reserve a Table')).toBeInTheDocument();
  });

  test('renders date input and time select', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
  });

  test('time select is populated with available times from API', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByText('17:00')).toBeInTheDocument();
    expect(screen.getByText('21:00')).toBeInTheDocument();
  });
});

describe('BookingForm — HTML5 validation attributes', () => {
  test('date input has required attribute', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByLabelText('Date')).toBeRequired();
  });

  test('date input has min set to today', () => {
    render(<BookingForm {...mockProps} />);
    const today = new Date().toISOString().split('T')[0];
    expect(screen.getByLabelText('Date')).toHaveAttribute('min', today);
  });

  test('time select has required attribute', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByLabelText('Time')).toBeRequired();
  });

  test('special requests textarea has maxLength of 500', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByLabelText(/special requests/i)).toHaveAttribute('maxlength', '500');
  });
});

describe('BookingForm — guests counter validation', () => {
  test('decrease button is disabled when guests equals 1', () => {
    render(<BookingForm {...mockProps} guests={1} />);
    expect(screen.getByLabelText('Decrease guests')).toBeDisabled();
  });

  test('increase button is disabled when guests equals 20', () => {
    render(<BookingForm {...mockProps} guests={20} />);
    expect(screen.getByLabelText('Increase guests')).toBeDisabled();
  });

  test('both counter buttons are enabled when guests is in valid range', () => {
    render(<BookingForm {...mockProps} guests={2} />);
    expect(screen.getByLabelText('Decrease guests')).not.toBeDisabled();
    expect(screen.getByLabelText('Increase guests')).not.toBeDisabled();
  });
});

describe('BookingForm — Continue button validation', () => {
  test('Continue is disabled when date and time are empty', () => {
    render(<BookingForm {...mockProps} date="" time="" />);
    expect(screen.getByText('Continue')).toBeDisabled();
  });

  test('Continue is disabled when only date is filled', () => {
    render(<BookingForm {...mockProps} date="2099-12-31" time="" />);
    expect(screen.getByText('Continue')).toBeDisabled();
  });

  test('Continue is disabled when only time is filled', () => {
    render(<BookingForm {...mockProps} date="" time="19:00" />);
    expect(screen.getByText('Continue')).toBeDisabled();
  });

  test('Continue is enabled when both date and time are filled', () => {
    render(<BookingForm {...mockProps} date="2099-12-31" time="19:00" />);
    expect(screen.getByText('Continue')).not.toBeDisabled();
  });

  test('selecting a new date fetches available times via API', () => {
    render(<BookingForm {...mockProps} />);
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-06-20' } });
    expect(window.fetchAPI).toHaveBeenCalled();
  });
});
