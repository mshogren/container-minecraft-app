import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Client, CombinedError, Provider } from 'urql';
import { fromValue, never } from 'wonka';
import ServerAddVanilla from './ServerAddVanilla';

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
        <ServerAddVanilla />
      </Provider>
    </BrowserRouter>
  );
}

describe('The add vanilla server page', () => {
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
});

describe('Submitting the vanilla server form', () => {
  const testData = {
    data: {
      versions: ['v1', 'v2', 'v3'],
    },
  };

  const serverName = 'server1';
  const serverVersion = 'v2';

  const submitForm = async () => {
    const textbox = await screen.findByTitle(/A name must be valid ASCII/);
    await userEvent.type(textbox, serverName);
    expect(textbox).toBeRequired();
    const option = await screen.findByText(serverVersion);
    await userEvent.click(option);
    const button = await screen.findByText('Add');
    await userEvent.click(button);
  };

  it('shows a loading message', async () => {
    const mockClient = createMockClient(() => fromValue(testData));

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Adding.../)).toBeTruthy());
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

    await submitForm();

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

    await submitForm();

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
            addVanillaServer: {
              error: 'api error',
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => {
      expect(screen.queryByText(/Error/)).toBeTruthy();
      expect(screen.queryByText(/api error/)).toBeTruthy();
    });
  });

  it('shows a completion message', async () => {
    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              server: {
                id: 'newId',
              },
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();

    await waitFor(() => expect(screen.queryByText(/Added/)).toBeTruthy());
  });

  it('rerenders the page when clicking OK on the error page', async () => {
    window.history.replaceState({}, '', '/');

    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              error: 'api error',
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();
    const button = await screen.findByRole('button');
    await userEvent.click(button);

    const textbox = await screen.findByTitle(/A name must be valid ASCII/);
    expect((textbox as HTMLInputElement).value).toBe(serverName);
    const hidden = await screen.findByTitle(/hidden/);
    expect((hidden as HTMLInputElement).value).toBe(serverVersion);
  });

  it('navigates to the servers page when clicking OK on the completion page', async () => {
    window.history.replaceState({}, '', '/');

    const mockClient = createMockClient(
      () => fromValue(testData),
      () => {
        return fromValue({
          data: {
            addVanillaServer: {
              server: {
                id: 'newId',
              },
            },
          },
        });
      }
    );

    renderElement(mockClient);

    await submitForm();
    const button = await screen.findByRole('button');
    await userEvent.click(button);

    expect(window.location.pathname).toBe('/servers');
  });
});
