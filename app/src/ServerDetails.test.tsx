import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider } from 'urql';
import { fromValue, never } from 'wonka';
import ServerDetails from './ServerDetails';

function renderElement(mockClient: Client): void {
  render(
    <BrowserRouter>
      <Provider value={mockClient}>
        <ServerDetails />
      </Provider>
    </BrowserRouter>
  );
}

describe('The server details page', () => {
  const testData = {
    data: {
      server: {
        id: 'Id1',
        name: 'Server 1',
        status: 'Status 1',
        created: new Date(),
      },
    },
  };

  it('shows a loading message', async () => {
    const mockClient = {
      executeQuery: () => never,
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Loading.../)).toBeTruthy());
  });

  it('shows a network error message', async () => {
    const mockClient = {
      executeQuery: () => {
        return fromValue({
          error: new CombinedError({
            networkError: Error('network error'),
          }),
        });
      },
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  it('shows an application error message', async () => {
    const mockClient = {
      executeQuery: () => {
        return fromValue({
          error: new CombinedError({
            graphQLErrors: [Error('application error')],
          }),
        });
      },
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  it('renders correctly', async () => {
    const mockClient = {
      executeQuery: () => fromValue(testData),
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Server 1/)).toBeTruthy();
    });
  });
});
