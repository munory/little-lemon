import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  window.matchMedia = window.matchMedia || ((query) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
});

test('renders home page with Little Lemon heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Little Lemon', level: 1 })).toBeInTheDocument();
});
