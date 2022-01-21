import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'urql';
import { never } from 'wonka';
import App from './App';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderElement(mockClient: any) {
  render(
    <BrowserRouter>
      <Provider value={mockClient}>
        <App />
      </Provider>
    </BrowserRouter>
  );
}

describe('The home page', () => {
  const mockClient = {
    executeQuery: jest.fn(() => never),
  };

  beforeEach(() => {
    renderElement(mockClient);
  });

  test('renders correctly', async () => {
    const button = await screen.findByRole('button');

    expect(button.innerHTML).toBe('GET STARTED');
  });

  test('navigates to servers', async () => {
    const button = await screen.findByRole('button');

    userEvent.click(button);

    expect(window.location.pathname).toBe('/servers');
  });
});
