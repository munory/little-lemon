import { render, screen } from '@testing-library/react';
import BookingConfirmed from './BookingConfirmed';

const mockProps = {
  reservationData: {
    firstName: 'Anna',
    date: '2099-12-31',
    time: '19:00',
    guests: 2,
  },
  onBackHome: jest.fn(),
  onViewMenu: jest.fn(),
};

describe('BookingConfirmed', () => {
  test('renders "Reservation Confirmed!" heading', () => {
    render(<BookingConfirmed {...mockProps} />);
    expect(screen.getByText('Reservation Confirmed!')).toBeInTheDocument();
  });

  test('displays firstName in the thank you message', () => {
    render(<BookingConfirmed {...mockProps} />);
    expect(screen.getByText('Anna')).toBeInTheDocument();
  });

  test('booking ref matches format #LL-XXXX', () => {
    render(<BookingConfirmed {...mockProps} />);
    expect(screen.getByText(/#LL-\d{4}/)).toBeInTheDocument();
  });
});
