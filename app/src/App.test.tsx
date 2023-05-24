import { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, Provider } from 'urql';
import { never } from 'wonka';
import { AuthProvider } from 'react-oidc-context';
import App from './App';

vi.mock('react-oidc-context', () => {
  return {
    AuthProvider: ({ children }: PropsWithChildren) => children,
    hasAuthParams: () => true,
    useAuth: () => {
      return { isAuthenticated: true, settings: {} };
    },
  };
});

function renderElement(mockClient: Client) {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Provider value={mockClient}>
          <App />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('The home page', () => {
  const mockClient = {
    executeQuery: () => never,
  } as unknown as Client;

  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    renderElement(mockClient);
  });

  it('renders correctly', async () => {
    const button = await screen.findByRole('button');

    expect(button.innerHTML).toBe('GET STARTED');
  });

  it('navigates to servers', async () => {
    const button = await screen.findByRole('button');

    await userEvent.click(button);

    expect(window.location.pathname).toBe('/servers');
  });
});
