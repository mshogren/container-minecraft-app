import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider, TypedDocumentNode } from 'urql';
import { fromValue, never } from 'wonka';
import Servers from './Servers';
import { GET_SERVERS } from './ServerQueries';

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

  it('renders with empty data', async () => {
    const mockClient = {
      executeQuery: () => {
        return fromValue({
          data: {
            servers: [],
          },
        });
      },
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() =>
      expect(screen.queryByText(/Nothing here/)).toBeTruthy()
    );
  });

  it('renders with data', async () => {
    const mockClient = {
      executeQuery: () => fromValue(testData),
    } as unknown as Client;

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Server 1/)).toBeTruthy();
      expect(screen.queryByText(/Server 2/)).toBeTruthy();
    });
  });

  it('navigates to the server by id', async () => {
    const mockClient = {
      executeQuery: ({ query }: { query: TypedDocumentNode }) => {
        if (query === GET_SERVERS) {
          return fromValue(testData);
        }
        return never;
      },
    } as unknown as Client;

    renderElement(mockClient);

    const buttons = await screen.findAllByRole('link');

    expect(buttons.length).toBe(2);

    userEvent.click(buttons[1]);

    expect(window.location.pathname).toBe('/Id2');
  });
});
