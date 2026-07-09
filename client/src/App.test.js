import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sedmica landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /pizzeria sedmica/i })).toBeInTheDocument();
});
