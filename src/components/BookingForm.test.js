import { render, screen, fireEvent } from '@testing-library/react';
import BookingForm from './BookingForm';

const mockProps = {
  draft: null,
  onContinue: jest.fn(),
  onBack: jest.fn(),
};

beforeEach(() => {
  window.fetchAPI = jest.fn().mockReturnValue(['17:00', '18:00', '19:00', '20:00', '21:00']);
});

describe('BookingForm', () => {
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

  test('Continue button is disabled when date and time are empty', () => {
    render(<BookingForm {...mockProps} />);
    expect(screen.getByText('Continue')).toBeDisabled();
  });

  test('Continue button enables after selecting a date and time', () => {
    render(<BookingForm {...mockProps} />);
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-12-31' } });
    fireEvent.change(screen.getByLabelText('Time'), { target: { value: '19:00' } });
    expect(screen.getByText('Continue')).not.toBeDisabled();
  });

  test('selecting a new date fetches available times via API', () => {
    render(<BookingForm {...mockProps} />);
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-06-20' } });
    expect(window.fetchAPI).toHaveBeenCalled();
  });
});
