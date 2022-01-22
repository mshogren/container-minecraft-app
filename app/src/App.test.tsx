import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, Provider } from 'urql';
import { never } from 'wonka';
import App from './App';

function renderElement(mockClient: Client) {
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
    executeQuery: () => never,
  } as unknown as Client;

  beforeEach(() => {
    renderElement(mockClient);
  });

  it('renders correctly', async () => {
    const button = await screen.findByRole('button');

    expect(button.innerHTML).toBe('GET STARTED');
  });

  it('navigates to servers', async () => {
    const button = await screen.findByRole('button');

    userEvent.click(button);

    expect(window.location.pathname).toBe('/servers');
  });
});
