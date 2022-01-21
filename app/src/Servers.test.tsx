import { CombinedError, Provider } from 'urql';
import { fromValue, never } from 'wonka';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Servers from './Servers';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderElement(mockClient: any) {
  render(
    <MemoryRouter>
      <Provider value={mockClient}>
        <Servers />
      </Provider>
    </MemoryRouter>
  );
}

describe('The servers page', () => {
  test('shows a loading message', async () => {
    const mockClient = {
      executeQuery: () => never,
    };

    renderElement(mockClient);

    await waitFor(() =>
      expect(screen.queryByText(/Loading.../)).toBeInTheDocument()
    );
  });

  test('shows a network error message', async () => {
    const mockClient = {
      executeQuery: jest.fn(() =>
        fromValue({
          error: new CombinedError({
            networkError: Error('network error'),
          }),
        })
      ),
    };

    renderElement(mockClient);

    await waitFor(() =>
      expect(screen.queryByText(/Error/)).toBeInTheDocument()
    );
  });

  test('shows an application error message', async () => {
    const mockClient = {
      executeQuery: jest.fn(() =>
        fromValue({
          error: new CombinedError({
            graphQLErrors: [Error('application error')],
          }),
        })
      ),
    };

    renderElement(mockClient);

    await waitFor(() =>
      expect(screen.queryByText(/Error/)).toBeInTheDocument()
    );
  });

  test('renders with empty data', async () => {
    const mockClient = {
      executeQuery: jest.fn(() =>
        fromValue({
          data: {
            servers: [],
          },
        })
      ),
    };

    renderElement(mockClient);

    await waitFor(() =>
      expect(screen.queryByText(/Nothing here/)).toBeInTheDocument()
    );
  });

  test('renders with data', async () => {
    const mockClient = {
      executeQuery: jest.fn(() =>
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
    };

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Server 1/)).toBeInTheDocument();
      expect(screen.queryByText(/Server 2/)).toBeInTheDocument();
    });
  });
});
