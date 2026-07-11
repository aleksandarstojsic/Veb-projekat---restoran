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

test('requires login before adding product to cart', () => {
  render(<App />);

  const guestOrderButtons = screen.getAllByRole('button', { name: /^prijava$/i });
  fireEvent.click(guestOrderButtons[guestOrderButtons.length - 1]);
  expect(screen.getByText(/prvo se prijavi ili registruj/i)).toBeInTheDocument();
});

test('adds menu product to cart after login', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'milos@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/lozinka/i), {
    target: { value: 'sedmica123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /^prijavi se$/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /dodaj/i })[0]);

  expect(screen.getByText(/1\.250 RSD po komadu/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /potvrdi porudzbinu/i })).toBeEnabled();
});

test('creates order from cart', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'milos@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/lozinka/i), {
    target: { value: 'sedmica123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /^prijavi se$/i }));
  fireEvent.click(screen.getAllByRole('button', { name: /dodaj/i })[0]);
  fireEvent.click(screen.getByRole('button', { name: /potvrdi porudzbinu/i }));

  expect(screen.getByText(/porudzbina SED-001 je primljena/i)).toBeInTheDocument();
  expect(screen.getAllByText(/SED-001/i)).toHaveLength(2);
});
