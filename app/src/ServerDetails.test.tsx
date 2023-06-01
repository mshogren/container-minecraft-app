import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider } from 'urql';
import { fromValue, never } from 'wonka';
import userEvent from '@testing-library/user-event';
import ServerDetails from './ServerDetails';

function createMockClient(
  executeQuery: CallableFunction,
  executeMutation: CallableFunction = () => never
): Client {
  return {
    executeQuery,
    executeMutation,
  } as unknown as Client;
}

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
        created: new Date(),
        id: 'Id1',
        name: 'Server 1',
        ports: [],
        started: new Date(),
        status: 'UNAVAILABLE',
      },
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

  it('renders correctly', async () => {
    const mockClient = createMockClient(() => fromValue(testData));

    renderElement(mockClient);

    await waitFor(() => {
      expect(screen.queryByText(/Server 1/)).toBeTruthy();
      expect(screen.queryByTitle(/start/)).toBeTruthy();
    });
  });

  ['start', 'stop'].forEach((action) => {
    describe(`when clicking ${action}`, () => {
      it('shows a loading message', async () => {
        testData.data.server.status =
          action === 'start' ? 'UNAVAILABLE' : 'AVAILABLE';
        const transientStatus = action === 'start' ? /starting/ : /stopping/;
        const mockClient = createMockClient(() => fromValue(testData));

        renderElement(mockClient);

        const button = await screen.findByTitle(action);
        await userEvent.click(button);

        expect(screen.queryByTitle(transientStatus)).toBeTruthy();
      });

      it('shows a network error message', async () => {
        const mockClient = createMockClient(
          () => fromValue(testData),
          () => {
            return fromValue({
              error: new CombinedError({
                networkError: Error('network error'),
              }),
            });
          }
        );

        renderElement(mockClient);

        const button = await screen.findByTitle(action);
        await userEvent.click(button);

        await waitFor(() => {
          expect(screen.queryByText(/Error/)).toBeTruthy();
          expect(screen.queryByText(/network error/)).toBeTruthy();
        });
      });

      it('shows an application error message', async () => {
        const mockClient = createMockClient(
          () => fromValue(testData),
          () => {
            return fromValue({
              error: new CombinedError({
                graphQLErrors: [Error('application error')],
              }),
            });
          }
        );

        renderElement(mockClient);

        const button = await screen.findByTitle(action);
        await userEvent.click(button);

        await waitFor(() => {
          expect(screen.queryByText(/Error/)).toBeTruthy();
          expect(screen.queryByText(/application error/)).toBeTruthy();
        });
      });

      it('shows an api error message', async () => {
        const mockClient = createMockClient(
          () => fromValue(testData),
          () => {
            return fromValue({
              data: {
                mutateServer: {
                  error: 'api error',
                },
              },
            });
          }
        );

        renderElement(mockClient);

        const button = await screen.findByTitle(action);
        await userEvent.click(button);

        await waitFor(() => {
          expect(screen.queryByText(/Error/)).toBeTruthy();
          expect(screen.queryByText(/api error/)).toBeTruthy();
        });
      });

      it('rerenders the page when clicking OK on the error page', async () => {
        const mockClient = createMockClient(
          () => fromValue(testData),
          () => {
            return fromValue({
              data: {
                mutateServer: {
                  error: 'api error',
                },
              },
            });
          }
        );

        renderElement(mockClient);

        const button = await screen.findByTitle(action);
        await userEvent.click(button);

        const okButton = await screen.findByRole('button');
        await userEvent.click(okButton);

        expect(screen.queryByText(/Server 1/)).toBeTruthy();
        expect(screen.queryByTitle(action)).toBeTruthy();
      });
    });
  });
});
