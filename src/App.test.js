import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page with Little Lemon heading', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Little Lemon', level: 1 })).toBeInTheDocument();
});
