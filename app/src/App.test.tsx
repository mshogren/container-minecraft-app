import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('Renders main page correctly', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(await screen.queryByText(/Nothing here/)).toBeInTheDocument();
});
