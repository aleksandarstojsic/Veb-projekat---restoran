import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sedmica landing page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /pizzeria sedmica/i })).toBeInTheDocument();
});

test('renders menu products and categories', () => {
  render(<App />);
  expect(screen.getAllByText(/sedmica 32cm/i)[0]).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /glavna jela/i })).toBeInTheDocument();
});
