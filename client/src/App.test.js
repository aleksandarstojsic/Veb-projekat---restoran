import { fireEvent, render, screen } from '@testing-library/react';
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

test('adds menu product to cart', () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole('button', { name: /dodaj/i })[0]);
  expect(screen.getByText(/1\.250 RSD po komadu/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /nastavi na porucivanje/i })).toBeEnabled();
});
