import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Client, CombinedError, Provider } from 'urql';
import { fromValue, never } from 'wonka';
import Servers from './Servers';

function renderElement(mockClient: Client): void {
  render(
    <MemoryRouter>
      <Provider value={mockClient}>
        <Servers />
      </Provider>
    </MemoryRouter>
  );
}

describe('The servers page', () => {
  it('shows a loading message', async () => {
    const mockClient = {
      executeQuery: () => never,
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Loading.../)).toBeTruthy());
  });

  it('shows a network error message', async () => {
    const mockClient = {
      executeQuery: vi.fn(() =>
        fromValue({
          error: new CombinedError({
            networkError: Error('network error'),
          }),
        })
      ),
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  it('shows an application error message', async () => {
    const mockClient = {
      executeQuery: vi.fn(() =>
        fromValue({
          error: new CombinedError({
            graphQLErrors: [Error('application error')],
          }),
        })
      ),
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  it('renders with empty data', async () => {
    const mockClient = {
      executeQuery: vi.fn(() =>
        fromValue({
          data: {
            servers: [],
          },
        })
      ),
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() =>
      expect(screen.queryByText(/Nothing here/)).toBeTruthy()
    );
  });

  it('renders with data', async () => {
    const mockClient = {
      executeQuery: vi.fn(() =>
        fromValue({
          data: {
            servers: [
              {
                id: 1,
                name: 'Server 1',
                status: 'Status 1',
                created: new Date(),
              },
              {
                id: 2,
                name: 'Server 2',
                status: 'Status 2',
                created: new Date(),
              },
            ],
          },
        })
      ),
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Server 1/)).toBeTruthy();
      expect(screen.queryByText(/Server 2/)).toBeTruthy();
    });
  });
});
