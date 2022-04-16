import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql';
import { fromValue, never } from 'wonka';
import Servers from './Servers';
import { GET_SERVERS } from './ServerQueries';
import App from './App';

function createMockClient(executeQuery: CallableFunction): Client {
  return {
    executeQuery,
  } as unknown as Client;
}

function renderElement(mockClient: Client): void {
  render(
    <BrowserRouter>
      <Provider value={mockClient}>
        <Servers />
      </Provider>
    </BrowserRouter>
  );
}

describe('The servers page', () => {
  const testData = {
    data: {
      servers: [
        {
          id: 'Id1',
          name: 'Server 1',
          status: 'Status 1',
          created: new Date(),
        },
        {
          id: 'Id2',
          name: 'Server 2',
          status: 'Status 2',
          created: new Date(),
        },
      ],
    },
  };

  it('shows a loading message', async () => {
    const mockClient = createMockClient(() => never);

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Loading.../)).toBeTruthy());
  });

  it('shows a network error message', async () => {
    const mockClient = createMockClient(() => {
      return fromValue({
        error: new CombinedError({
          networkError: Error('network error'),
        }),
      });
    });

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  it('shows an application error message', async () => {
    const mockClient = createMockClient(() => {
      return fromValue({
        error: new CombinedError({
          graphQLErrors: [Error('application error')],
        }),
      });
    });

    renderElement(mockClient);

    await waitFor(() => expect(screen.queryByText(/Error/)).toBeTruthy());
  });

  ['servers', 'servers/serverid'].forEach((path) => {
    it('navigates to the root when clicking OK on the error page', async () => {
      window.history.replaceState({}, '', `/${path}`);

      const mockClient = createMockClient(() => {
        return fromValue({
          error: new CombinedError({
            graphQLErrors: [Error('application error')],
          }),
        });
      });

      render(
        <BrowserRouter>
          <Provider value={mockClient}>
            <App />
          </Provider>
        </BrowserRouter>
      );

      const button = await screen.findByRole('button');
      await userEvent.click(button);

      expect(window.location.pathname).toBe('/');
    });
  });

  it('renders with empty data', async () => {
    const mockClient = createMockClient(() => {
      return fromValue({
        data: {
          servers: [],
        },
      });
    });

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Nothing here/)).toBeTruthy();
      expect(screen.queryByTitle(/add/)).toBeTruthy();
      expect(screen.queryByTitle(/refresh/)).toBeTruthy();
    });
  });

  it('renders with data', async () => {
    const mockClient = createMockClient(() => fromValue(testData));

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Server 1/)).toBeTruthy();
      expect(screen.queryByText(/Server 2/)).toBeTruthy();
      expect(screen.queryByTitle(/add/)).toBeTruthy();
      expect(screen.queryByTitle(/refresh/)).toBeTruthy();
    });
  });

  describe('navigates', () => {
    beforeEach(() => {
      window.history.replaceState({}, '', '/');

      const mockClient = createMockClient(
        ({ query }: { query: TypedDocumentNode }) => {
          if (query === GET_SERVERS) return fromValue(testData);
          return never;
        }
      );

      renderElement(mockClient);
    });

    it('to the server by id', async () => {
      const links = await screen.findAllByRole('link');
      expect(links.length).toBe(2);

      await userEvent.click(links[1]);
      expect(window.location.pathname).toBe('/Id2');
    });

    it('to the add server form', async () => {
      const button = await screen.findByTitle('add');
      await userEvent.click(button);
      expect(window.location.pathname).toBe('/add');
    });
  });
});
